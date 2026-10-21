const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();
app.use(express.static('public'));
app.use(express.json());

// Endpoint de comunicación HTTP y JSON[cite: 7]
app.post('/api/consultar', (req, res) => {
    const { sintomas } = req.body;
    
    if (!sintomas || !Array.isArray(sintomas) || sintomas.length === 0) {
        return res.status(400).json({ error: "Datos insuficientes" });
    }

    // Transformación de la solicitud en una consulta Prolog controlada[cite: 7]
    const queryList = `[${sintomas.join(',')}]`;
    const comando = `swipl -q -f experto.pl -g "api_diagnosticar(${queryList}), halt."`;

    exec(comando, { shell: 'powershell.exe' }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error de ejecución: ${error.message}`);
            return res.status(500).json({ error: "Error en el motor de inferencia de Prolog." });
        }
        try {
            // El resultado en stdout se convierte a JSON[cite: 7]
            const result = JSON.parse(stdout);
            res.json(result);
        } catch (parseError) {
            console.error("Error al convertir salida de Prolog a JSON:", stdout);
            res.status(500).json({ error: "Error procesando las conclusiones del sistema lógico." });
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Sistema Experto ejecutándose en el puerto ${PORT}`));