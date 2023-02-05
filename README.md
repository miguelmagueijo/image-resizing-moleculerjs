# **image-resizing-moleculerjs**
Small project to resize a given image from an URL. Result can be a Javascript Buffer or Base64 string. Only supports URLs that end with image extension.
<br>
API built with moleculer-web and UI all custom made (with Bulma CSS and native HTTP package).
<br>This project was a small challenge to test out moleculerjs REST API and to get used to Docker and how to create Docker images.
## **Run**
You can run the project in two ways:
1. With Docker
2. Without Docker
### **1. With Docker**
On this directory (root) run the command `docker-compose up --build`
#### **Customization**
Ports - change them on .env file.
### **2. Without Docker**
You will need two command lines.<br>
On one command line, inside the API folder, run `npm i` and then `npm run dev`<br>
On the second command line, inside de UI folder, run `npm run dev`<br>
#### **Customization**
They support env vars, but they aren't read from .env file, you will need to set them in the command line.

**Variables**:
- API: API_PORT (default:3000), API_HOST (default: 0.0.0.0)
- UI: UI_PORT (default: 8080), UI_HOST (default: 0.0.0.0), API_PORT (default: undefinied/3000)

**Reminder**- If you change API port or API host you need to change the URL_STRING inside [request.js](UI/public/js/request.js)