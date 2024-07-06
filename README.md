# Global Museum Management Application

## Introduction
This project is part of my BSc Computer Science degree thesis at Eötvös Loránd University. The Global Museum Management Application aims to enhance the tourist experience and promote city culture by providing a comprehensive platform for managing museums. It serves three primary user groups: administrators, tourists, and cities, offering functionalities such as museum data management, ticket booking, and cultural promotion.

## Features
- **City Registration**: Cities can register and manage their museums, including detailed descriptions, ticket information, and visiting days.
- **Tourist Registration**: Tourists can register, book tickets, view past bookings, and receive tickets with unique QR codes.
- **Admin Dashboard**: Administrators can manage city and tourist profiles, ensuring the smooth operation of the system.

## Installation Guide
1. **Install Node.js**: [Node.js Download](https://nodejs.org/en/download)
2. **Install Visual Studio Code**: [Visual Studio Code Download](https://code.visualstudio.com/download)
3. **Install Git**: [Git Download](https://git-scm.com/downloads)
4. **Clone the Repository**:
    ```bash
    git clone https://github.com/muradhuseynov1/museum-app
    ```
5. **Install Dependencies**:
    ```bash
    cd global-museum-management
    npm install
    cd museum-app1
    npm install
    cd ../node-server
    npm install
    cd ../functions
    npm install
    ```
6. **Run the Application**:
    ```bash
    cd global-museum-management
    npm start
    ```

## Dependencies
The application uses various dependencies for frontend, backend, and database management. Key dependencies include:
- React.js
- Node.js
- Firebase
- Material UI
- Express
- Leaflet

## Usage
### City Account
- **City Dashboard**: View and manage museums, add new museums, and update museum details.
- **Add/Edit Museum**: Enter museum details, ticket prices, and operating hours.
- **Museum Details**: View detailed information about museums, including images and location.

### Tourist Account
- **Tourist Dashboard**: Explore countries and cities with museums, view weather reports.
- **Museum Details**: View museum information, book tickets, and read reviews.
- **Book Ticket**: Select tickets, choose visiting dates, and receive PDF tickets via email.
- **Reviews**: Add and view reviews for museums.

### Admin Account
- **Admin Dashboard**: Manage city and tourist accounts, generate city IDs, and oversee system operations.

## Testing
### React and Firebase Tests
1. **Run Tests**:
    ```bash
    cd museum-app1
    npm test
    ```

### Node.js Tests
1. **Run Tests**:
    ```bash
    cd node-server
    npm test
    ```

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments
I would like to thank my supervisor, Dr. Szabó László Ferenc, and my family and friends for their support throughout this project.

---

For more detailed information, please refer to the full project documentation.
