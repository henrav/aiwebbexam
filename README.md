För att köra detta projekt lokalt krävs det att följande programvara är installerad på din dator:
- [Node.js](https://nodejs.org/en/)
- [MySQL](https://www.mysql.com/)
- installera dessa först innan något

## installation
1. Klona detta repo
2. Navigera till mappen `client` sedan navigera till mappen `my-app` sedan kör `npm install` i terminalen
3. efter installationen är färdig kör `npm start` i terminalen
4. öppna sedan upp `DatabaseManager.js` och ändra `host`, `user`, `password` och `database` till dina egna värden
5. öppna sedan upp en ny terminal och navigera till mappen `server` och kör `npm start`
6. nu är du klar och kan börja använda applikationen

## problemshooting
1. mysql kan ibland slänga error ifall du inte redan har en databas som heter `AI_Exam_Web_App_DB`
2. ifall detta sker kan man behöva skapa en databas med detta namn och köra `npm start` igen
3. då borde detta fungera
4. alltså, öppna upp mysql workbench och skriv `CREATE DATABASE AI_Exam_Web_App_DB;`tror jag borde funka
5. den vill iallafall att man har en databas som heter de redan.
6. testa annars att bara köra `npm start` igen, det borde funka, efter du har stängt av en gång

4. om problemet fortfarande framstår, se till att `client/my-app` innehåller `node_modules` och `server` innehåller `node_modules`
5. annars kör `npm install` i respektive mapp

6. ifall problemet fortfarande framstår, kontakta mig på `henrav-2@student.ltu.se`
7. jag svarar så fort jag kan, säger vi, orkar inte lista ut några fler problemshooting tips just nu.
8. lycka till,

## användning
1. använd inte för mycket av min OpenAi API key, jag har bara 4.87 dollar kvar.
2. och ja man ska inte lägga ut sina nycklar på internet, ingen kommer se detta endå