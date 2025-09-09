# OlympicGamesStarter
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.3.
To start this project, make sure your terminal is inside the "Projet_2" folder.  
Run `cd Projet_2`, then install the dependencies with `npm install`.
## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`.
## Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.
## Where to start
The predefined architecture includes (in addition to the default angular architecture) the following:
- `components` folder:  contains the components used to display the dashboard and its details
- `core` folder: contains the business logic and the components used across the entire application (`components`, `services` and `models` folders).
- `assets` folder: contains mock data (olympic.json) and folder img.
## How to use
The application "Olympic games app" allows the user to access a dashboard displaying informations about past Olympic Games.
This informations are presented in graphical form: a pie chart on the first page and a line chart on the second page.
When this application opens, the user is taken directly to the first page.
This page displays:
- The number of Olympic Games participations.
- The number of represented countries.
- The number of medals per country shown in the pie chart.
On click on an element of the pie chart (a selected country), the user is redirected to the details page, which provides additional informations about the selected country, including:
- The number of participations for this country.
- The total number of medals won by this country across all editions.
- The total number of athletes who have represented the country.
- A line chart showing, year by year, the number of medals won (On desktop, a tooltip also displays additional informations: medals, city, atlhetes).
Finally, at the bottom of the page, a button labeled "Back to medals per country" allows the user to return to the first page of the application.
## Dependencies
- Angular Material(^18.2.14) for add a mat-card styles into the dashboard and dashboard-details components. 
- Ngx echarts (^17.2.0): for displaying pie-chart and line-chart into the dashboard and dashboard-details components.
