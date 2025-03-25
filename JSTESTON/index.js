window.onload = function() {
    const form = document.getElementById("testForm");
    const startTestButton = document.getElementById('startTestButton');
    startTestButton.addEventListener("click", cargaJson);
    const resetButton = document.getElementById("resetButton");
    resetButton.addEventListener("click",restartTest);
};

// Función para cargar el JSON
function cargaJson(event) {
    event.preventDefault(); // Evita que el formulario se envíe y recargue la página
    
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (file && file.type === 'application/json') {
        const reader = new FileReader();

        reader.onload = function(event) {
            try {
                const jsonData = JSON.parse(event.target.result); // Parseamos el archivo JSON

                // Una vez cargado el JSON, ocultamos el formulario y mostramos el contenedor de las preguntas
                document.getElementById("formContainer").style.display = "none";
                document.getElementById("testContainer").style.display = "block";
                document.getElementById("resultContainer").style.display = "block";

                startTest(jsonData); // Iniciamos el test con los datos cargados
            } catch (error) {
                alert('Error al leer el archivo JSON.');
            }
        };

        reader.readAsText(file); // Leemos el archivo como texto
    } else {
        alert('Por favor, selecciona un archivo JSON válido.');
    }
}

function startTest(data) {
    let currentQuestionIndex = 0;
    let correctAnswers = 0;

    // Mostrar la primera pregunta
    showQuestion(data, currentQuestionIndex);
    //Me gustaria que si hay más de 10 preguntas, se muestren solo 10 preguntas aleatorias
    //Pero sin repetir preguntas
    //Me gustaria que si hay menos de 10 preguntas, se muestren todas las preguntas
    //Hay un problema cuando hay más de 10 preguntas y no muestra el resultado final
    // Función para mostrar preguntas
    function showQuestion(data, index) {
        if(data.length > 10){
            data = data.sort(() => Math.random() - 0.5);
            data = data.slice(0, 10);
        }
        else{
            data = data;
        }
        const questionData = data[index];
        const questionContainer = document.getElementById("testContainer");
        // Limpiar el contenedor de preguntas
        questionContainer.innerHTML = '';
        opciones = questionData.opciones;
        // Barajar las opciones de respuesta que no se repitan
        opciones = opciones.sort(() => Math.random() - 0.5
        ).filter((item, index, self) => self.indexOf(item) === index);
        questionData.opciones = opciones;
        // Mostrar la pregunta y las opciones
        const questionElement = document.createElement('div');
        questionElement.innerHTML = `
            <p>${questionData.enunciado_pregunta}</p>
            ${questionData.opciones.map((option, i) => `
                <button class="answerButton" onclick="checkAnswer('${option}', '${questionData.opcion_correcta}', ${index})">
                    ${option}
                </button>
            `).join('')}
        `;
        questionContainer.appendChild(questionElement);
    }

    // Función para verificar las respuestas
    window.checkAnswer = function(selectedAnswer, correctAnswer, questionIndex) {
        // Reproducir el sonido correspondiente según si la respuesta es correcta o incorrecta
        if (selectedAnswer === correctAnswer) {
            correctAnswers++;
            playSound('correct-answer.mp3'); // Sonido de respuesta correcta
        } else {
            playSound('incorrect-answer.mp3'); // Sonido de respuesta incorrecta
        }

        currentQuestionIndex++;

        // Si no hay más preguntas, mostramos el resultado
        if (currentQuestionIndex < data.length && currentQuestionIndex < 10) {
            showQuestion(data, currentQuestionIndex);
        } else {
            showResult(correctAnswers, data.length);
        }
    }

    // Función para mostrar los resultados
    function showResult(correctAnswers) {
        const resultContainer = document.getElementById("resultContainer");
        const score = (correctAnswers / 10) * 10; // Calcular la nota como 0-10
        resultContainer.innerHTML = `Has acertado ${correctAnswers} de 10 preguntas.<br>Nota: ${score.toFixed(2)}`;

        // Reproducir el sonido según la nota
        if (score >= 5) {
            playSound('pass-test.mp3'); // Sonido de éxito
        } else {
            playSound('fail-test.mp3'); // Sonido de fracaso
        }

        // Mostrar el botón de reiniciar
        document.getElementById("resetButton").style.display = "block";
    }

    // Función para reproducir sonidos
    function playSound(filename) {
        const audio = new Audio(filename); // Carga el archivo de audio
        audio.play(); // Reproduce el audio
    }
}

// Función para reiniciar el test
function restartTest() {
    // Reiniciar el formulario de carga y ocultar los contenedores del test y resultado
    resultContainer.innerHTML ="";
    document.getElementById("formContainer").style.display = "block";
    document.getElementById("testContainer").style.display = "none";
    document.getElementById("resultContainer").style.display = "none";

    // Limpiar el input de archivo
    document.getElementById("fileInput").value = "";

    // Ocultar el botón de reiniciar
    document.getElementById("resetButton").style.display = "none";
}
