:- use_module(library(http/json)).

% --- Base de conocimientos de los sintomas del carro ---
sintoma(dificultad_encendido).
sintoma(luces_debiles).
sintoma(humo_blanco).
sintoma(humo_negro).
sintoma(sobrecalentamiento).
sintoma(chirrido_frenos).
sintoma(volante_vibra).
sintoma(tirones_motor).
sintoma(charco_liquido_verde).
sintoma(charco_liquido_negro).
sintoma(olor_combustible).
sintoma(pedal_freno_suave).
sintoma(perdida_potencia).
sintoma(testigo_bateria).
sintoma(testigo_aceite).
sintoma(ruido_metalico).
sintoma(olor_quemado).
sintoma(frenos_largos).
sintoma(ralenti_inestable).
sintoma(consumo_excesivo).
sintoma(manchas_piso).

% --- Reglas de inferencia ---
falla_detectada(bateria_muerta, Sints) :-
    member(dificultad_encendido, Sints),
    member(luces_debiles, Sints).

falla_detectada(alternador_dano, Sints) :-
    falla_detectada(bateria_muerta, Sints),
    member(testigo_bateria, Sints).

falla_detectada(junta_culata_quemada, Sints) :-
    member(humo_blanco, Sints),
    member(sobrecalentamiento, Sints).

falla_detectada(fuga_refrigerante, Sints) :-
    member(charco_liquido_verde, Sints),
    member(sobrecalentamiento, Sints).

falla_detectada(fuga_aceite, Sints) :-
    member(charco_liquido_negro, Sints),
    member(testigo_aceite, Sints).

falla_detectada(mezcla_gasolina_mala, Sints) :-
    member(humo_negro, Sints),
    member(olor_combustible, Sints).

falla_detectada(pastillas_freno_desgastadas, Sints) :-
    member(chirrido_frenos, Sints).

falla_detectada(fuga_liquido_frenos, Sints) :-
    member(pedal_freno_suave, Sints).

falla_detectada(llantas_desbalanceadas, Sints) :-
    member(volante_vibra, Sints).

falla_detectada(bujias_defectuosas, Sints) :-
    member(tirones_motor, Sints),
    member(perdida_potencia, Sints).

% --- Lo que le vamos a recomendar al usuario ---
solucion(bateria_muerta, "Checar el voltaje de la bateria. Lo mas seguro es recargarla o comprar una nueva.").
solucion(alternador_dano, "Cambiar el alternador. Si no lo haces, te va a descargar la bateria nueva tambien.").
solucion(junta_culata_quemada, "Apaga el carro ya. Vas a necesitar grua y una reparacion mayor en el motor.").
solucion(fuga_refrigerante, "Checar las mangueras y el radiador. Ponle mas anticongelante.").
solucion(fuga_aceite, "Revisar el carter abajo y el filtro. Ni se te ocurra prenderlo si no trae aceite.").
solucion(mezcla_gasolina_mala, "Toca limpiar los inyectores y revisar el sensor de oxigeno.").
solucion(pastillas_freno_desgastadas, "Cambia las balatas de los frenos lo mas pronto posible por seguridad.").
solucion(fuga_liquido_frenos, "Peligro: No lo manejes asi. Revisa las lineas de los frenos y la bomba.").
solucion(llantas_desbalanceadas, "Llevalo a una llantera para que le hagan balanceo y alineacion.").
solucion(bujias_defectuosas, "Cambiar las bujias y checar los cables de encendido.").

% --- Logica interna y preparacion para la API ---
armar_diagnostico(Sints, Falla, Solucion) :-
    falla_detectada(Falla, Sints),
    solucion(Falla, Solucion).

evaluar_carro(Sints, ResultadosFinales) :-
    findall(
        _{causa: Falla, recomendacion: Solucion},
        armar_diagnostico(Sints, Falla, Solucion),
        ListaTemp
    ),
    ( ListaTemp = [] ->
        ResultadosFinales = [_{causa: sin_coincidencias, recomendacion: "No encontre una falla exacta con esos sintomas. Mejor llevalo a un mecanico de confianza."}]
    ; ResultadosFinales = ListaTemp
    ).

% ESTE ES EL QUE MANDA LLAMAR NODE.JS (No cambiar el nombre)
api_diagnosticar(SintomasFront) :-
    evaluar_carro(SintomasFront, JsonRes),
    json_write_dict(current_output, _{diagnosticos: JsonRes}).