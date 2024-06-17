/*<form id="formAtualizar" class="dados-form">
<label>Nome: <input type="text" name="nome_sobrenome" value="${item.nome_sobrenome}"></label><br>
<label>CPF: <input type="text" name="cpf_cliente" value="${item.cpf_cliente}" readonly></label><br>
<label>Email: <input type="text" name="email_cliente" value="${item.email_cliente}"></label><br>
<label>Data de Nascimento: <input type="text" name="data_nascimento" value="${item.data_nascimento}"></label><br>
<label>Bairro: <input type="text" name="bairro_cliente" value="${item.bairro_cliente}"></label><br>
<label>Rua: <input type="text" name="rua_cliente" value="${item.rua_cliente}"></label><br>
<label>Número: <input type="text" name="numero_cliente" value="${item.numero_cliente}"></label><br>
<label>Cidade: <input type="text" name="cidade_cliente" value="${item.cidade_cliente}"></label><br>
<label>Estado: <input type="text" name="estado_cliente" value="${item.estado_cliente}"></label><br>
<label>CEP: <input type="text" name="cep_cliente" value="${item.cep_cliente}"></label><br>
<label>Nome de Usuário: <input type="text" name="nome_usuario" value="${item.nome_usuario}"></label><br>
<label>Senha: <input type="text" name="senha_usuario" value="${item.senha_usuario}"></label><br>
<label>Valor de Usuário: <input type="text" name="valor_usuario" value="${item.valor_usuario}"></label><br>
<button type="button" onclick="atualizarDados()">Salvar</button>
<button type="button" onclick="limparFormulario()">Limpar</button>
</form>*/




function openModal(modalId) {
    document.getElementById(modalId).style.display = "block";
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

window.onclick = function(event) {
    const modal = document.getElementById('loginModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const cpf = document.getElementById('cpf').value;
    const senha = document.getElementById('senha').value;
    try {
        const response = await fetch('/api/buscarmongo/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cpf, senha })
        });
        if (response.status === 404) {
            document.getElementById('result').innerText = 'Usuário não encontrado';
        } else if (response.status === 401) {
            document.getElementById('result').innerText = 'Senha incorreta';
        } else {
            const userData = await response.json();
            document.getElementById('result').innerText = 'Login bem-sucedido';
            closeModal('loginModal');
            updateUserInterface(userData);

            // Guardar o CPF digitado em uma variável
            var chamarcpf = cpf;
            console.log('CPF armazenado:', chamarcpf);
        }
    } catch (err) {
        document.getElementById('result').innerText = 'Erro ao fazer login';
    }
});

function updateUserInterface(user) {
    // Remover link de login
    const loginLink = document.getElementById('loginLink');
    loginLink.parentNode.removeChild(loginLink);

    // Adicionar informações do usuário
    const userInfoContainer = document.getElementById('userInfoContainer');
    userInfoContainer.innerHTML = `
        <span>Nome: ${user.nome_usuario}</span>
        <span>CPF: ${user.cpf_cliente}</span>
    `;
}





// Função para abrir o modal
function openModal(modalId) {
    document.getElementById(modalId).style.display = "block";
}

// Função para fechar o modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

window.onclick = function(event) {
    const modal = document.getElementById('loginModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
// Função de login
document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const cpf = document.getElementById('cpf').value;
    const senha = document.getElementById('senha').value;
    try {
        const response = await fetch('/api/buscarmongo/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cpf, senha })
        });
        if (response.status === 404) {
            document.getElementById('result').innerText = 'Usuário não encontrado';
        } else if (response.status === 401) {
            document.getElementById('result').innerText = 'Senha incorreta';
        } else {
            const userData = await response.json();
            document.getElementById('result').innerText = 'Login bem-sucedido';
            closeModal('loginModal');
            updateUserInterface(userData);

            // Guardar o CPF digitado em uma variável
            var chamarcpf = cpf;
            console.log('CPF armazenado:', chamarcpf);
        }
    } catch (err) {
        document.getElementById('result').innerText = 'Erro ao fazer login';
    }
});

function updateUserInterface(user) {
    // Remover link de login
    const loginLink = document.getElementById('loginLink');
    loginLink.style.display = 'none';

    // Mostrar nome e CPF do usuário
    const userName = document.getElementById('userName');
    const userCPF = document.getElementById('userCPF');
    userName.innerText = `Nome: ${user.nome}`;
    userCPF.innerText = `CPF: ${user.cpf}`;

    // Mostrar links de "Visualizar e Apagar" e "Alterar Dados"
    const visualizarApagarLink = document.getElementById('visualizarApagarLink');
    const alterarDadosLink = document.getElementById('alterarDadosLink');
    visualizarApagarLink.classList.remove('hidden');
    alterarDadosLink.classList.remove('hidden');
}