// Função para adicionar senha geral
function addGeneralPassword() {
    fetch('http://10.0.1.16:3001/api/add-general', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao adicionar senha geral');
        }
        return response.json();
    })
    .then(data => {
        console.log('Resposta da API:', data);
    })
    .catch(error => {
        console.error('Erro:', error);
    });
}

// Função para adicionar senha preferencial
function addPreferentialPassword() {
    fetch('http://10.0.1.16:3001/api/add-preferential', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao adicionar senha preferencial');
        }
        return response.json();
    })
    .then(data => {
        console.log('Resposta da API:', data);
    })
    .catch(error => {
        console.error('Erro:', error);
    });
}

// Adicionando eventos aos botões
document.getElementById('add-general').addEventListener('click', addGeneralPassword);
document.getElementById('add-preferential').addEventListener('click', addPreferentialPassword);
