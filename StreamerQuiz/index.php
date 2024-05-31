<?php
session_start();
echo "<!DOCTYPE html>";
echo "<html lang='es'>";
echo "<head>";
    echo "<meta charset='UTF-8'>";
    echo "<meta name='viewport' content='width=device-width, initial-scale=1.0'>";
    echo "<title>Streamer Quiz</title>";
    echo "<link rel='stylesheet' href='./css/index.css'>";
echo "</head>";
echo "<body>";

if (isset($_POST["jugar"])) {
    if (isset($_POST['modo']) && !isset($_SESSION['modo'])) {
        $modo = $_POST['modo'];
        $_SESSION['modo'] = $modo;
    } else if (isset($_SESSION['modo'])) {
        $modo = $_SESSION['modo'];
    }
    generaDivPreguntas($modo);

} else if (isset($_POST["respuesta"])) {
    $respuesta = $_POST["streamerElegido"];
    procesaRespuesta($respuesta);

} else {
    inicia_datos_juego();
    panel_inicio();
}

echo "</body>";
echo "</html>";

// Funcionalidad aplicación Streamer Quiz

function inicia_datos_juego() {
    $_SESSION["numero_preguntas"] = 0;
    $_SESSION["numero_aciertos"] = 0;
    $_SESSION["streamers_grandes"] = ["ibai","auronplay","illojuan","mixwell","desst3","rubius","elmariana","spursito","quackitytoo","elxokas","djmariio","elspreen","knekro","juansguarnizo","litkillah","martinciriook","jcorko_","thegrefg","josedeodo","gerardromero","keznit1","nissaxter","alexelcapo","xcry","carreraaa","perxitaa","aquino","aldo_geo","ijenz","elded","c0ker","deqiuv","revenant","putupau","axozer","bananirou","alphasniper97","iamcristinini","staryuuki","santutu","unicornio","goncho","agustabell212","mym_alkapone","rickyedit","ricoy","zeling","sirmaza","orslok","tvander","arturofernandeztv","th3antonio","jujalag","menostrece","coolifegame","arigameplays","facudiazt","reborn","huronarolera","carola","farfadoxvevo","rakyz","criticas_qls","elbokeron","werlyb","hitboxking","agentemaxo","agentemaxo","jaggerprincesa","bystaxx","ernesbarbeq","guanyar","folagorlives","blackespanolito","biyin_","littleragergirl","conterstine","daarick","reventxz","nickdaboom","winghaven","pituherranz","maau","soypan","sujagg","nakoo_fn","natalan","latesitoo","akuasmr","silithur","aroyitt","papomc","mayichi","jelty","thedanirep","nimuvt","vegetta777","willyrex","elesky"];
    $_SESSION["streamers_peques"] = ["nekoritox", "yourlittlecookie", "zeroretr0", "mossqar", "perjav88","estycute","ivandaix","oikawagk","mia_whiskas","xmario","naimsonicertw","yumiwaifu","axelgohh","soulchainer","don_palomino","maxlgnd","soyunapatatalmao","ninnastream","luciadrk","juanfivgc","demet_vrs","raphdok_","Inocente_Gamer","barbiestefi","mattlemon_","uvetubervt","soy_Zudvt","dionisiaco032","bea_maravilla","kevingamex_yt","geoadictos","theaespanov2","hispanoles","programacion_es","0joaquin0","miuna119","delmoyou","masoto_","spiritfire212","ferbasics","mikuworld_","rixmerhd","buresfran","sangmig","marc_chabe","maudear","horus97i","nickitacraftgames","cyrtame","xusojonesoficial","",];
    $_SESSION["modo"] = null;
}


function obtenerSeguidores($streamer){
    $url = "https://twitchtracker.com/$streamer";

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, como Gecko) Chrome/58.0.3029.110 Safari/537.36");
    
    $html = curl_exec($ch);
    curl_close($ch);
    
    if (!$html) {
        return "No disponible";
    }
    
    $doc = new DOMDocument();
    libxml_use_internal_errors(true);
    $doc->loadHTML($html);
    libxml_clear_errors();
    
    $xpath = new DOMXPath($doc);
    $specificNode = $xpath->query("//div[contains(.//div[@class='g-x-s-label color-followers'], 'Total followers')]/div[contains(@class, 'g-x-s-value g-x-s-contrast')]/div[2]");
    if ($specificNode->length > 0) {
        return trim($specificNode->item(0)->nodeValue);
    } else {
        return "No disponible";
    }
}

function obtenerLogo($streamer){
    $url = "https://twitchtracker.com/$streamer";

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, como Gecko) Chrome/58.0.3029.110 Safari/537.36");
    
    $html = curl_exec($ch);
    curl_close($ch);
    
    if (!$html) {
        return "default_logo.png";
    }
    
    $doc = new DOMDocument();
    libxml_use_internal_errors(true);
    $doc->loadHTML($html);
    libxml_clear_errors();
    
    $xpath = new DOMXPath($doc);
    $specificNode = $xpath->query("/html/body/div[2]/div[2]/div[2]/div/div[2]/div[1]/img");
    if ($specificNode->length > 0) {
        return $specificNode->item(0)->getAttribute('src');
    } else {
        return "default_logo.png";
    }
}

function panel_inicio(){
    echo "<section>";
        echo "<div class='tarjeta' id='pregunta'>";
            echo "<h2 class='titulo'>Bienvenido a Streamer Quiz</h2>";
            echo "<form action='./index.php' method='POST'>";
                echo "<select name='modo' id='modo'>";
                    echo "<option value='grandes'>Streamer Grandes</option>";
                    echo "<option value='peques'>Streamer Pequeños</option>";
                echo "</select>";
                echo "<input align='center' type='submit' value='Jugar' name='jugar'>";
            echo "</form>";
        echo "</div>";
    echo "</section>"; 
}

function generaNumAleatorio($max){
    return rand(0, $max);
}

function generaDivPreguntas($modo){
    switch($modo){
        case "grandes":
            $arrayDatos = $_SESSION['streamers_grandes'];
            break;
        case "peques":
            $arrayDatos = $_SESSION['streamers_peques'];
            break;
    }
    $count = count($arrayDatos);

    $max = $count - 1;

    $id1 = generaNumAleatorio($max);
    do {
        $id2 = generaNumAleatorio($max);
    } while ($id2 == $id1);

    $streamer1 = $arrayDatos[$id1];
    $streamer2 = $arrayDatos[$id2];
    $_SESSION['streamer1'] = $streamer1;
    $_SESSION['streamer2'] = $streamer2;

    $_SESSION["streamer1_logo"] = obtenerLogo("$streamer1");
    $_SESSION["streamer2_logo"] = obtenerLogo("$streamer2");

    $streamer1_logo = $_SESSION["streamer1_logo"];
    $streamer2_logo = $_SESSION["streamer2_logo"];

    echo "<section>";
        echo "<div class='tarjeta' id='pregunta'>";
            echo "<table>";
                echo "<tr>";
                    echo "<th colspan='2' class='titulo'><h1>¿Quién Tiene Más Seguidores?</h1></th>";
                echo "</tr>";
                echo "<tr>";
                    echo "<td><h2 align='center'>$streamer1</h2></td>";
                    echo "<td><h2 align='center'>$streamer2</h2></td>";
                echo "</tr>";
                echo "<tr>";
                    echo "<td><img src='$streamer1_logo' alt='$streamer1'></td>";
                    echo "<td><img src='$streamer2_logo' alt='$streamer2'></td>";
                echo "</tr>";
                echo "<tr>";
                    echo "<form action='./index.php' method='post'>";
                        echo "<td><input type='radio' value='$streamer1' name='streamerElegido' checked> $streamer1</td>";
                        echo "<td><input type='radio' value='$streamer2' name='streamerElegido'> $streamer2</td>";
                echo "</tr>";
                echo "<tr>";
                    echo "<td colspan='2'><input align='center' type='submit' value='respuesta' name='respuesta'></td>";
                    echo "</form>";
                echo "</tr>";
            echo "</table>";
        echo "</div>";
    echo "</section>";
}

function procesaRespuesta($respuesta){
    $streamer1 = $_SESSION["streamer1"];
    $streamer2 = $_SESSION["streamer2"];

    $seguidores_streamer1 = obtenerSeguidores($streamer1);
    $seguidores_streamer2 = obtenerSeguidores($streamer2);;

    $streamer1_logo = $_SESSION["streamer1_logo"];
    $streamer2_logo = $_SESSION["streamer2_logo"];

    if($respuesta == $streamer1){
        $seguidores_respuesta = $seguidores_streamer1;
        $seguidores_otro = $seguidores_streamer2;
    } else {
        $seguidores_respuesta = $seguidores_streamer2;
        $seguidores_otro = $seguidores_streamer1;
    }

    if($seguidores_respuesta >= $seguidores_otro){
        $_SESSION["numero_aciertos"]++;
        $resultado = "Has Acertado";
    } else {
        $resultado = "Has Fallado";
    }

    $_SESSION["numero_preguntas"]++;
    $aciertos = $_SESSION["numero_aciertos"];
    $intentos = $_SESSION["numero_preguntas"];

    echo "<section>";
    echo "<div class='tarjeta' id='pregunta'>";
        echo "<table>";
            echo "<tr>";
                echo "<th colspan='2' align='center' class='titulo'><h2>$resultado</h2></th>";
            echo "</tr>";
            echo "<tr>";
                echo "<td colspan='2'><h2 align='center' class='titulo'>$aciertos/$intentos aciertos</h2></td>";
            echo "</tr>";
            echo "<tr>";
                echo "<td><h2 align='center'>$streamer1</h2></td>";
                echo "<td><h2 align='center'>$streamer2</h2></td>";
            echo "</tr>";
            echo "<tr>";
                echo "<td><img src='$streamer1_logo' alt='$streamer1'></td>";
                echo "<td><img src='$streamer2_logo' alt='$streamer2'></td>";
            echo "</tr>";
            echo "<tr>";
                echo "<td><h2 align='center'>$seguidores_streamer1</h2></td>";
                echo "<td><h2 align='center'>$seguidores_streamer2</td>";
            echo "</tr>";
            echo "<tr>";
                echo "<td colspan='2'>";
                    echo "<form action='./index.php' method='POST'>";
                        echo "<input align='center' type='submit' value='Volver a Jugar' name='jugar'>";
                    echo "</form>";
                echo "</td>";
            echo "</tr>";
        echo "</table>";
    echo "</div>";
    echo "</section>";
}
?>
