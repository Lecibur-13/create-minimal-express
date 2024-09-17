#!/usr/bin/env node

import inquirer from 'inquirer';
import git from 'simple-git';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener __dirname en módulos ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Preguntar al usuario el nombre del proyecto
async function askProjectName() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'projectName',
            message: '¿Cuál es el nombre de tu proyecto?',
            validate: function (input) {
                if (!input) {
                    return 'El nombre del proyecto no puede estar vacío.';
                }
                return true;
            }
        }
    ]);

    return answers.projectName;
}

// Crear el proyecto y clonar el repositorio
async function createProject() {
    try {
        const projectName = await askProjectName();
        const projectPath = path.join(process.cwd(), projectName);

        // Verificar si la carpeta ya existe
        if (fs.existsSync(projectPath)) {
            console.error(`La carpeta "${projectName}" ya existe.`);
            return;
        }

        // Crear el directorio
        fs.mkdirSync(projectPath);

        console.log(`Creando el proyecto "${projectName}"...`);

        // Clonar el repositorio
        await git().clone('https://github.com/Lecibur-13/Minimalist-Express.git', projectPath);

        console.log('Repositorio clonado con éxito.');

        // Instalar las dependencias
        console.log('Instalando dependencias...');
        execSync('npm install', { cwd: projectPath, stdio: 'inherit' });

        console.log('Proyecto creado e inicializado con éxito.');
    } catch (error) {
        console.error('Hubo un error durante el proceso:', error.message);
    }
}

createProject();
