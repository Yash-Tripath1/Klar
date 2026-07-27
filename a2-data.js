/* Klar A2 course: twenty practical lessons, using the same lesson schema as the A1 course. */
const A2_COURSE = [
  {
    unit: "A2.1",
    title: "Life in motion",
    lessons: [
      {
        id: "a2-1",
        title: "Moving and renting",
        goal: "Describe a home and ask practical questions.",
        grammar:
          "Use weil to give a reason. The verb moves to the end: …weil die Wohnung ruhig ist.",
        phrase: "Die Wohnung gefällt mir, weil sie hell ist.",
        translation: "I like the apartment because it is bright.",
        vocab: [
          ["die Miete", "rent", "die"],
          ["umziehen", "to move house", ""],
          ["hell", "bright", ""],
          ["ruhig", "quiet", ""],
        ],
        quiz: ["What does die Miete mean?", "rent", ["room", "move", "quiet"]],
      },
      {
        id: "a2-2",
        title: "Work and responsibilities",
        goal: "Talk about work tasks and schedules.",
        grammar:
          "müssen and sollen are useful modal verbs for duties and advice.",
        phrase: "Ich muss den Bericht heute fertig machen.",
        translation: "I have to finish the report today.",
        vocab: [
          ["die Aufgabe", "task", "die"],
          ["fertig", "finished", ""],
          ["wichtig", "important", ""],
          ["besprechen", "to discuss", ""],
        ],
        quiz: [
          "What does wichtig mean?",
          "important",
          ["ready", "weekly", "difficult"],
        ],
      },
      {
        id: "a2-3",
        title: "Appointments",
        goal: "Arrange, change, and confirm appointments.",
        grammar: "Könnten Sie…? is a polite, useful request form.",
        phrase: "Könnten wir den Termin verschieben?",
        translation: "Could we postpone the appointment?",
        vocab: [
          ["der Termin", "appointment", "der"],
          ["verschieben", "to postpone", ""],
          ["bestätigen", "to confirm", ""],
          ["frei", "available", ""],
        ],
        quiz: [
          "What is der Termin?",
          "appointment",
          ["ticket", "meeting room", "calendar"],
        ],
      },
      {
        id: "a2-4",
        title: "Healthy routines",
        goal: "Describe habits and give simple advice.",
        grammar: "Du solltest… means “you should…”.",
        phrase: "Du solltest mehr Wasser trinken.",
        translation: "You should drink more water.",
        vocab: [
          ["gesund", "healthy", ""],
          ["genug", "enough", ""],
          ["trainieren", "to exercise", ""],
          ["sich fühlen", "to feel", ""],
        ],
        quiz: [
          "Which word means healthy?",
          "gesund",
          ["enough", "tired", "careful"],
        ],
      },
      {
        id: "a2-5",
        title: "Habits and change",
        goal: "Talk about what you are trying to change.",
        grammar:
          "seit + dative describes something continuing since a point in time.",
        phrase: "Seit einem Monat lerne ich jeden Tag.",
        translation: "I have been learning every day for a month.",
        vocab: [
          ["seit", "since", ""],
          ["gewohnt", "used to", ""],
          ["ändern", "to change", ""],
          ["täglich", "daily", ""],
        ],
        quiz: [
          "What does täglich mean?",
          "daily",
          ["rarely", "since", "usual"],
        ],
      },
    ],
  },
  {
    unit: "A2.2",
    title: "Stories and experiences",
    lessons: [
      {
        id: "a2-6",
        title: "Telling a story",
        goal: "Put past events in order.",
        grammar:
          "Use zuerst, dann, danach, and schließlich to sequence a story.",
        phrase: "Zuerst sind wir angekommen, dann haben wir gegessen.",
        translation: "First we arrived, then we ate.",
        vocab: [
          ["zuerst", "first", ""],
          ["danach", "after that", ""],
          ["plötzlich", "suddenly", ""],
          ["schließlich", "finally", ""],
        ],
        quiz: [
          "What does danach mean?",
          "after that",
          ["first", "suddenly", "finally"],
        ],
      },
      {
        id: "a2-7",
        title: "Travel experiences",
        goal: "Talk about a trip and problems on the way.",
        grammar:
          "The perfect tense uses haben or sein: Ich bin gefahren; ich habe besucht.",
        phrase: "Der Zug ist leider zu spät gekommen.",
        translation: "Unfortunately, the train arrived too late.",
        vocab: [
          ["die Reise", "trip", "die"],
          ["verpassen", "to miss", ""],
          ["ankommen", "to arrive", ""],
          ["leider", "unfortunately", ""],
        ],
        quiz: [
          "What does leider mean?",
          "unfortunately",
          ["luckily", "late", "trip"],
        ],
      },
      {
        id: "a2-8",
        title: "People you know",
        goal: "Describe personality and relationships.",
        grammar:
          "Relative clauses add information: Das ist der Freund, der in Berlin wohnt.",
        phrase: "Sie ist jemand, der immer zuhört.",
        translation: "She is someone who always listens.",
        vocab: [
          ["geduldig", "patient", ""],
          ["ehrlich", "honest", ""],
          ["hilfsbereit", "helpful", ""],
          ["zuverlässig", "reliable", ""],
        ],
        quiz: [
          "What does ehrlich mean?",
          "honest",
          ["friendly", "helpful", "patient"],
        ],
      },
      {
        id: "a2-9",
        title: "Giving an opinion",
        goal: "Say what you think and why.",
        grammar:
          "Ich finde, dass… introduces a personal opinion. The verb goes to the end after dass.",
        phrase: "Ich finde, dass das eine gute Idee ist.",
        translation: "I think that is a good idea.",
        vocab: [
          ["die Meinung", "opinion", "die"],
          ["meiner Meinung nach", "in my opinion", ""],
          ["sinnvoll", "useful / sensible", ""],
          ["trotzdem", "nevertheless", ""],
        ],
        quiz: [
          "Which phrase means “in my opinion”?",
          "meiner Meinung nach",
          ["ich glaube", "deshalb", "zum Beispiel"],
        ],
      },
      {
        id: "a2-10",
        title: "Comparing things",
        goal: "Compare choices and preferences.",
        grammar:
          "Comparatives often end in -er: schneller, günstiger. Use als for “than”.",
        phrase: "Der Zug ist schneller als der Bus.",
        translation: "The train is faster than the bus.",
        vocab: [
          ["schneller", "faster", ""],
          ["günstiger", "cheaper", ""],
          ["bequemer", "more comfortable", ""],
          ["vergleichen", "to compare", ""],
        ],
        quiz: [
          "What does günstiger mean?",
          "cheaper",
          ["faster", "expensive", "comfortable"],
        ],
      },
    ],
  },
  {
    unit: "A2.3",
    title: "Getting things done",
    lessons: [
      {
        id: "a2-11",
        title: "At the doctor",
        goal: "Explain symptoms and understand basic advice.",
        grammar: "Mir tut … weh means “my … hurts”.",
        phrase: "Mir tut der Kopf weh.",
        translation: "My head hurts.",
        vocab: [
          ["die Schmerzen", "pain", "die"],
          ["die Tablette", "tablet", "die"],
          ["untersuchen", "to examine", ""],
          ["die Praxis", "doctor's practice", "die"],
        ],
        quiz: [
          "What is die Tablette?",
          "tablet",
          ["practice", "pain", "appointment"],
        ],
      },
      {
        id: "a2-12",
        title: "Phone calls",
        goal: "Handle a simple telephone conversation.",
        grammar:
          "Am Telefon, use Kann ich bitte mit… sprechen? to ask for someone.",
        phrase: "Kann ich bitte mit Frau Müller sprechen?",
        translation: "May I please speak with Ms Müller?",
        vocab: [
          ["der Anruf", "call", "der"],
          ["erreichbar", "reachable", ""],
          ["zurückrufen", "to call back", ""],
          ["die Nachricht", "message", "die"],
        ],
        quiz: [
          "What does zurückrufen mean?",
          "to call back",
          ["to answer", "to reach", "to leave"],
        ],
      },
      {
        id: "a2-13",
        title: "Services and complaints",
        goal: "Explain a problem politely.",
        grammar:
          "Leider funktioniert… nicht is clear and polite for reporting a problem.",
        phrase: "Leider funktioniert mein Internet nicht.",
        translation: "Unfortunately, my internet does not work.",
        vocab: [
          ["kaputt", "broken", ""],
          ["reparieren", "to repair", ""],
          ["das Problem", "problem", "das"],
          ["beschweren", "to complain", ""],
        ],
        quiz: [
          "What does kaputt mean?",
          "broken",
          ["late", "expensive", "repair"],
        ],
      },
      {
        id: "a2-14",
        title: "Giving advice",
        goal: "Recommend a next step.",
        grammar: "an deiner Stelle means “in your place”.",
        phrase: "An deiner Stelle würde ich warten.",
        translation: "In your place, I would wait.",
        vocab: [
          ["der Rat", "advice", "der"],
          ["empfehlen", "to recommend", ""],
          ["warten", "to wait", ""],
          ["versuchen", "to try", ""],
        ],
        quiz: [
          "What does empfehlen mean?",
          "to recommend",
          ["to wait", "to try", "to advise"],
        ],
      },
      {
        id: "a2-15",
        title: "Rules and permissions",
        goal: "Understand what is allowed and required.",
        grammar: "dürfen means “to be allowed to”; verboten means “forbidden”.",
        phrase: "Hier darf man nicht rauchen.",
        translation: "You may not smoke here.",
        vocab: [
          ["erlaubt", "allowed", ""],
          ["verboten", "forbidden", ""],
          ["die Regel", "rule", "die"],
          ["rauchen", "to smoke", ""],
        ],
        quiz: [
          "What does verboten mean?",
          "forbidden",
          ["allowed", "rule", "required"],
        ],
      },
    ],
  },
  {
    unit: "A2.4",
    title: "Connections",
    lessons: [
      {
        id: "a2-16",
        title: "Invitations",
        goal: "Invite people and respond naturally.",
        grammar: "Hättest du Lust…? is a relaxed way to invite someone.",
        phrase: "Hättest du Lust, mitzukommen?",
        translation: "Would you like to come along?",
        vocab: [
          ["einladen", "to invite", ""],
          ["mitkommen", "to come along", ""],
          ["Lust haben", "to feel like", ""],
          ["absagen", "to cancel", ""],
        ],
        quiz: [
          "What does absagen mean?",
          "to cancel",
          ["to invite", "to come", "to accept"],
        ],
      },
      {
        id: "a2-17",
        title: "Plans and promises",
        goal: "Talk about future intentions.",
        grammar:
          "werden + infinitive can express the future, but present tense often works too.",
        phrase: "Ich werde dir morgen schreiben.",
        translation: "I will write to you tomorrow.",
        vocab: [
          ["versprechen", "to promise", ""],
          ["bestimmt", "definitely", ""],
          ["hoffentlich", "hopefully", ""],
          ["planen", "to plan", ""],
        ],
        quiz: [
          "What does hoffentlich mean?",
          "hopefully",
          ["definitely", "soon", "planned"],
        ],
      },
      {
        id: "a2-18",
        title: "Media and culture",
        goal: "Talk about what you watch, read, and enjoy.",
        grammar: "über + accusative means “about”: ein Film über Musik.",
        phrase: "Die Serie handelt von einer Familie.",
        translation: "The series is about a family.",
        vocab: [
          ["die Serie", "series", "die"],
          ["handeln von", "to be about", ""],
          ["spannend", "exciting", ""],
          ["langweilig", "boring", ""],
        ],
        quiz: [
          "What does spannend mean?",
          "exciting",
          ["boring", "series", "culture"],
        ],
      },
      {
        id: "a2-19",
        title: "At a celebration",
        goal: "Make small talk at a social event.",
        grammar:
          "Schon lange? asks “for a long time already?” in conversation.",
        phrase: "Wie lange kennst du die Gastgeberin schon?",
        translation: "How long have you known the host already?",
        vocab: [
          ["die Feier", "celebration", "die"],
          ["der Gastgeber", "host", "der"],
          ["kennen", "to know", ""],
          ["gratulieren", "to congratulate", ""],
        ],
        quiz: [
          "What does gratulieren mean?",
          "to congratulate",
          ["to celebrate", "to invite", "to know"],
        ],
      },
      {
        id: "a2-20",
        title: "Your own conversation",
        goal: "Connect ideas with confidence.",
        grammar:
          "At A2, aim to add reasons, reactions, and follow-up questions—not perfect sentences.",
        phrase: "Das klingt interessant. Erzähl mir mehr davon.",
        translation: "That sounds interesting. Tell me more about it.",
        vocab: [
          ["klingen", "to sound", ""],
          ["erzählen", "to tell", ""],
          ["eigentlich", "actually", ""],
          ["jedenfalls", "anyway", ""],
        ],
        quiz: [
          "What does erzählen mean?",
          "to tell",
          ["to sound", "to ask", "to answer"],
        ],
      },
    ],
  },
];
