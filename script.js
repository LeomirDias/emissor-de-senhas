// Função para enviar a requisição POST
const sendRequest = async (url) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message || "Senha adicionada com sucesso!");
        } else {
            alert(result.error || "Erro ao adicionar senha.");
        }
    } catch (error) {
        console.error("Erro ao enviar requisição:", error);
        alert("Erro ao conectar com o servidor.");
    }
};

// Adiciona a senha preferencial
document.getElementById('btnSenhaPreferencial').addEventListener('click', () => {
    const url = 'http://<IP_DA_VM>:3000/add-preferential'; // Substitua pelo IP da sua aplicação principal
    sendRequest(url);
});

// Adiciona a senha geral
document.getElementById('btnSenhaGeral').addEventListener('click', () => {
    const url = 'http://<IP_DA_VM>:3000/add-general'; // Substitua pelo IP da sua aplicação principal
    sendRequest(url);
});

//Ajusta a data do footer automaticamente
document.getElementById('year').textContent = new Date().getFullYear();