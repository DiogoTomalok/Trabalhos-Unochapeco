
/*document.getElementById('loginForm').addEventListener('submit', async function (e) {
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

// Outras funções e manipuladores de evento aqui...
*/








function showPage(pageId) {
    const pages = document.querySelectorAll('section');
    pages.forEach(page => {
        if (page.id === pageId) {
            page.classList.remove('hidden');
        } else {
            page.classList.add('hidden');
        }
    });
}

document.getElementById('form-criar-usuario').addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
    try {
        const response = await fetch('/api/criarmongo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (response.ok) {
            alert('Usuário criado com sucesso!');
        } else {
            alert('Erro ao criar usuário: ' + result.message);
        }
    } catch (error) {
        alert('Erro ao enviar solicitação: ' + error.message);
    }
    // Adicionar envio de dados para o PostgreSQL aqui
    try {
        const response = await fetch('/criarconta/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (response.ok) {
            alert('Usuário criado com sucesso no PostgreSQL!');
        } else {
            
        }
    } catch (error) {
        
    }
});

document.getElementById('formBuscar').addEventListener('submit', async function(event) {
    event.preventDefault();
    const cpf = document.getElementById('inputCPF').value.trim();
    if (cpf) {
        try {
            const response = await fetch(`/buscar/dados?cpf_cliente=${cpf}`);
            const data = await response.json();
            mostrarDados(data);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            document.getElementById('dadosCliente').innerHTML = 'Erro ao buscar dados. Por favor, tente novamente.';
        }
    }
});

async function buscarDados() {
    const cpf = document.getElementById('inputCPFBusca').value.trim();
    if (cpf) {
        try {
            const response = await fetch(`/alterardados/dados?cpf_cliente=${cpf}`);
            const data = await response.json();
            if (data.length > 0) {
                mostrarFormularioEdicao(data[0]);
            } else {
                alert('Dados não encontrados para este CPF.');
            }
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            alert('Erro ao buscar dados. Por favor, tente novamente.');
        }
    }
}

function mostrarFormularioEdicao(item) {
    const formularioEdicaoDiv = document.getElementById('formularioEdicao');
    formularioEdicaoDiv.style.display = 'block';

    formularioEdicaoDiv.innerHTML = `
        <h2>Atualizar Cliente</h2>
        <form id="formAtualizar" class="dados-form">
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
        </form>
    `;
}

async function atualizarDados() {
    const form = document.getElementById('formAtualizar');
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    console.log('Dados a serem enviados para atualização:', data);

    try {
        const response = await fetch('/alterardados/dados', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Dados atualizados com sucesso!');
        } else {
            alert('Erro ao atualizar dados.');
        }
    } catch (error) {
        console.error('Erro ao atualizar dados:', error);
        alert('Erro ao atualizar dados.');
    }
}

function limparFormulario() {
    document.getElementById('formAtualizar').reset();
}

function mostrarDados(dados) {
    const dadosClienteDiv = document.getElementById('dadosCliente');
    dadosClienteDiv.innerHTML = ''; // Limpa o conteúdo anterior
    if (dados.length === 0) {
        dadosClienteDiv.textContent = 'Dados não encontrados para este CPF.';
    } else {
        dados.forEach((item, index) => {
            const tabela = document.createElement('table');
            tabela.classList.add('dados-tabela');
            tabela.innerHTML = `
                <tr><th colspan="2">Cliente ${index + 1}</th></tr>
                <tr><th>Nome</th><td>${item.nome_sobrenome}</td></tr>
                <tr><th>CPF</th><td>${item.cpf_cliente}</td></tr>
                <tr><th>Email</th><td>${item.email_cliente}</td></tr>
                <tr><th>Data de Nascimento</th><td>${item.data_nascimento}</td></tr>
                <tr><th>Bairro</th><td>${item.bairro_cliente}</td></tr>
                <tr><th>Rua</th><td>${item.rua_cliente}</td></tr>
                <tr><th>Número</th><td>${item.numero_cliente}</td></tr>
                <tr><th>Cidade</th><td>${item.cidade_cliente}</td></tr>
                <tr><th>Estado</th><td>${item.estado_cliente}</td></tr>
                <tr><th>CEP</th><td>${item.cep_cliente}</td></tr>
                <tr>
                    <td colspan="2">
                        <button onclick="apagarDados('${item.cpf_cliente}')">Apagar</button>
                    </td>
                </tr>
            `;
            dadosClienteDiv.appendChild(tabela);
        });
    }
}

function apagarDados(cpf) {
    if (confirm("Tem certeza de que deseja apagar os dados relacionados a este CPF?")) {
        fetch(`/buscar/dados?cpf_cliente=${cpf}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert('Dados apagados com sucesso!');
                document.getElementById('dadosCliente').innerHTML = ''; // Limpa o conteúdo após a exclusão
            } else {
                alert('Erro ao apagar dados. Por favor, tente novamente.');
            }
        })
        .catch(error => {
            console.error('Erro ao apagar dados:', error);
            alert('Erro ao apagar dados. Por favor, tente novamente.');
        });
    }
}

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
            displayUserData(userData);
        }
    } catch (err) {
        document.getElementById('result').innerText = 'Erro ao fazer login';
    }
});

function displayUserData(user) {
    const loginSection = document.getElementById('login');
    loginSection.innerHTML = `
        <h2>Dados do Usuário</h2>
        <p><strong>Nome:</strong> ${user.nome_usuario}</p>
        <p><strong>CPF:</strong> ${user.cpf_cliente}</p>
    `;
}

// Funções adicionais aqui (showPage, form submission handlers, etc.)


function displayUserData(user) {
    const userInfo = document.createElement('div');
    userInfo.innerHTML = `
        <h2>Dados do Usuário</h2>
        <p><strong>Nome:</strong> ${user.nome_usuario}</p>
        <p><strong>CPF:</strong> ${user.cpf_cliente}</p>
        
    `;
    document.body.appendChild(userInfo);
}

function showPage(pageId) {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        if (section.id === pageId) {
            section.classList.remove('hidden');
        } else {
            section.classList.add('hidden');
        }
    });
}

