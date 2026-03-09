let questionPool = [];

 loadQuestions();

 async function loadQuestions() {
      try {
        const response = await fetch("questionpool.json");
        const questionsFromServer = await response.json();

        questionPool = questionsFromServer;

        console.log("Kérdések betöltve:", questionPool);
      } catch (error) {
        console.error("Hiba a kérdések betöltésekor:", error);
      }
    }

// Fisher–Yates shuffle
    function shuffleArray(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }
    
    let questions = questionPool.slice(); // aktuális, megjelenített kérdéssor

    function renderQuiz() {
      const quizEl = document.getElementById("quiz");
      quizEl.innerHTML = "";
      questions.forEach((q, index) => {
        const qDiv = document.createElement("div");
        qDiv.className = "question";
        qDiv.id = "question-" + index;

        const title = document.createElement("h3");
        title.textContent = (index + 1) + ". " + q.q;
        qDiv.appendChild(title);

        const optsDiv = document.createElement("div");
        optsDiv.className = "options";

        q.a.forEach((optText) => {
          const label = document.createElement("label");
          const input = document.createElement("input");
          input.type = "radio";

          const letter = optText.trim().charAt(0); // 'a','b','c','d'
          input.name = "q" + index;
          input.value = letter;

          label.appendChild(input);
          const span = document.createElement("span");
          span.innerHTML = " " + optText;
          label.appendChild(span);

          optsDiv.appendChild(label);
        });

        qDiv.appendChild(optsDiv);
        quizEl.appendChild(qDiv);
      });
    }

    function checkAnswers() {
      let correctCount = 0;
      const wrongIndexes = [];

      questions.forEach((q, idx) => {
        const qDiv = document.getElementById("question-" + idx);
        if (!qDiv) return;

        qDiv.classList.remove("correct", "incorrect");

        const previouslyShown = qDiv.querySelector(".correct-answer");
        if (previouslyShown) previouslyShown.remove();

        const selected = document.querySelector("input[name='q" + idx + "']:checked");

        if (!selected) {
          qDiv.classList.add("incorrect");
          wrongIndexes.push(q.index);
          const ca = document.createElement("div");
          ca.className = "correct-answer";
          ca.textContent = "Helyes válasz: " + q.correct.toUpperCase();
          qDiv.appendChild(ca);
          return;
        }

        if (selected.value === q.correct) {
          correctCount++;
          qDiv.classList.add("correct");
        } else {
          qDiv.classList.add("incorrect");
          wrongIndexes.push(q.index);
          const ca = document.createElement("div");
          ca.className = "correct-answer";
          ca.textContent = "Helyes válasz: " + q.correct.toUpperCase();
          qDiv.appendChild(ca);
        }
      });

      const resultEl = document.getElementById("result");
      resultEl.style.display = "block";
      const percent = Math.round((correctCount / questions.length) * 100);
      const passed = percent >= 60;

      resultEl.className = "result " + (passed ? "result-ok" : "result-fail");

      let msg = `Eredmény: ${correctCount}/${questions.length} jó válasz (${percent}%).`;
      if (wrongIndexes.length > 0) {
        msg += " Rossz kérdések eredeti indexe: " + wrongIndexes.join(", ") + ".";
      } else {
        msg += " Minden kérdésre helyesen válaszoltál!";
      }
      resultEl.textContent = msg;
    }

    function shuffleQuestions() {
      // Kevert sorrendű kérdéssor; ha később nagyobb poolod lesz,
      // itt elég a shuffleArray(questionPool).slice(0, 50)-et használni.
      questions = shuffleArray(questionPool).slice(0, 50);
      document.getElementById("result").style.display = "none";
      renderQuiz();
    }

    document.getElementById("checkBtn").addEventListener("click", checkAnswers);
    document.getElementById("shuffleBtn").addEventListener("click", shuffleQuestions);

    // első betöltéskor is legyen egy sorrend (nem kevert vagy akár kevert)
    shuffleQuestions();