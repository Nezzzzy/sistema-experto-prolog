const express = require('express');
const { exec } = require('child_process');
const os = require('os'); // Módulo para detectar Windows o Linux

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.post('/api/consultar', (req, res) => {
    const sintomas = req.body.sintomas;

    if (!sintomas || sintomas.length === 0) {
        return res.status(400).json({ error: "No se proporcionaron síntomas." });
    }

    const listaSintomas = '[' + sintomas.join(',') + ']';
    const comando = `swipl -s experto.pl -g "api_diagnosticar(${listaSintomas})" -t halt`;

    // Si es tu compu (Windows) usa PowerShell, si es Render (Linux) usa la normal
    const opcionesShell = os.platform() === 'win32' ? { shell: 'powershell.exe' } : {};

    exec(comando, opcionesShell, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error de ejecución: ${error.message}`);
            return res.status(500).json({ error: "Error en el motor de inferencia de Prolog." });
        }

        try {
            const match = stdout.match(/\{.*\}/s);
            if (match) {
                const jsonRespuesta = JSON.parse(match[0]);
                res.json(jsonRespuesta);
            } else {
                res.status(500).json({ error: "Formato de respuesta inválido." });
            }
        } catch (parseError) {
            console.error("Error al parsear JSON:", parseError);
            res.status(500).json({ error: "Error al leer resultados lógicos." });
        }
    });
});

app.listen(port, () => {
    console.log(`Sistema Experto ejecutándose en el puerto ${port}`);
});