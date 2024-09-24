const horariosMaterias = {
    "Matemáticas": "09:00-10:00",
    "Historia": "10:00-11:00",
    "Biología": "11:00-12:00",
    "Química": "12:00-13:00"
};

document.getElementById('materia').addEventListener('change', function() {
    const materia = this.value;
    const infoDiv = document.getElementById('info');
    
    if (materia) {
        const horario = horariosMaterias[materia];
        infoDiv.textContent = Horario disponible: ${horario};
    } else {
        infoDiv.textContent = '';
    }
});

document.getElementById('asignar').addEventListener('click', function() {
    const input = document.getElementById('input').value.split('\n');
    const aulas = document.getElementById('aulas').value.split(',').map(aula => aula.trim());
    const horarios = [];

    input.forEach(line => {
        const [horario, aula] = line.split(',').map(item => item.trim());
        if (horario && aula) {
            horarios.push({ horario, aula });
        }
    });

    const resultado = asignarClases(horarios, aulas);
    document.getElementById('resultado').innerHTML = resultado;
});

function parseHorario(horario) {
    const [inicio, fin] = horario.split('-');
    return {
        inicio: new Date(1970-01-01T${inicio}:00),
        fin: new Date(1970-01-01T${fin}:00)
    };
}

function haySolapamiento(horario1, horario2) {
    return (horario1.inicio < horario2.fin && horario1.fin > horario2.inicio);
}

function asignarClases(horarios, aulas) {
    const asignaciones = {};
    const ocupaciones = {};

    horarios.forEach(({ horario, aula }) => {
        const { inicio, fin } = parseHorario(horario);

        if (!aulas.includes(aula) || ocupaciones[aula]) return;

        let puedeAsignar = true;

        if (!ocupaciones[aula]) {
            ocupaciones[aula] = [];
        }

        ocupaciones[aula].forEach(ocupado => {
            if (haySolapamiento(parseHorario(ocupado), { inicio, fin })) {
                puedeAsignar = false;
            }
        });

        if (puedeAsignar) {
            asignaciones[aula] = asignaciones[aula] || [];
            asignaciones[aula].push(horario);
            ocupaciones[aula].push(horario); // Marca el horario como ocupado
        }
    });

    return Object.entries(asignaciones)
        .map(([aula, horarios]) => ${aula}: ${horarios.join(', ')})
        .join('<br>') || 'No se pudo asignar ninguna clase';
}