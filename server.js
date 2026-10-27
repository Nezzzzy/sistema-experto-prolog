const express = require('express');
const { exec } = require('child_process');
const os = require('os');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.post('/api/consultar', (req, res) => {
    try {
        const sintomas = req.body.sintomas;

        if (!sintomas || sintomas.length === 0) {
            return res.status(400).json({ error: "No se proporcionaron síntomas." });
        }

        const listaSintomas = '[' + sintomas.join(',') + ']';
        // Agregamos la bandera -q para que Prolog no imprima mensajes de bienvenida basura
        const comando = `swipl -q -s experto.pl -g "api_diagnosticar(${listaSintomas})" -t halt`;

        const opcionesShell = os.platform() === 'win32' ? { shell: 'powershell.exe' } : {};

        exec(comando, opcionesShell, (error, stdout, stderr) => {
            if (error) {
                console.error("Error de Prolog:", error.message);
                return res.status(500).json({ error: "El motor lógico falló internamente." });
            }

            try {
                // Buscamos solo lo que tenga formato de JSON
                const match = stdout.match(/\{.*\}/s);
                if (match) {
                    const jsonRespuesta = JSON.parse(match[0]);
                    res.json(jsonRespuesta);
                } else {
                    res.status(500).json({ error: "Prolog no devolvió una respuesta válida." });
                }
            } catch (parseError) {
                res.status(500).json({ error: "Error al formatear la respuesta lógica." });
            }
        });
    } catch (ex) {
        // Si el código de Node choca, atrapamos el error aquí y devolvemos JSON
        res.status(500).json({ error: "Fallo crítico en el servidor de Node.js." });
    }
});

// Capturador de errores globales de Express para que NUNCA devuelva un HTML de Render
app.use((err, req, res, next) => {
    res.status(500).json({ error: "Error interno del servidor web." });
});

// Forzamos a que escuche en todas las redes (0.0.0.0) para evitar bloqueos en Render
app.listen(port, '0.0.0.0', () => {
    console.log(`Sistema Experto ejecutándose en el puerto ${port}`);
});