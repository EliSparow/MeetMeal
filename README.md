# MeetMeal
### Projet de fin de formation de la Coding Academy
Sujet attribué par une autre équipe qui sera Product Owner du projet. 
Ce projet a été réalisé selon une méthodologie AGILE sur une durée de **3 semaines**, décomposé en 3 rush d'une semaine.

Version live
[Meet-Meal](https://meetmeal.netlify.com/)

Lien live de l'API :
[Dev](https://meetmeal-dev.herokuapp.com/)

Repo Client:
[MeetMeal-Client](https://github.com/EliSparow/MeetMeal-client)

Réalisé par :
- Fabrice LATRI [fabolododo](https://github.com/fabolododo)
- Julie NGUYEN [PetiteYuli](https://github.com/PetiteYuli)
- Maxime ANDRE [maxim3andr3](https://github.com/maxim3andr3)
- Emilie HAYOUN [EmiBabyDev](https://github.com/EmiBabyDev)
- Max de PONFILLY [EliSparow](https://github.com/elisparow)
- Laura BOUDIER [laurabdier](https://github.com/laurabdier)

Outils utilisés:
- Trello
- Heroku : hébergement de l'API avec un pipeline dev-prod
- Netlify : hébergement de l'app React


Technos utilisées:
- MongoDB
- Eexpress
- React
- NodeJs

Architecture du repo:
```
src
  │   .env                  # Environment variables [TO CREATE]
  │   package.json          
  │   package-lock.json  
  │   app.js                # App entry point
  └───config                # Configuration DB connection
  └───controllers           # Express controllers functions
  └───routes                # Express route for all the endpoints of the app
  └───middleware
  └───models                # Database models
  └───tests                 # All the unit tests
```
