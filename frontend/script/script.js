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
//cria usuario
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


//busca dados do cpf  para exibição e delete
document.addEventListener('DOMContentLoaded', buscarDadosPorCpf);
document.addEventListener('DOMContentLoaded', function() {
    const dadosClienteDiv  = document.querySelector('a[href="#"][onclick="showPage(\'visualizarapagar\')"]');
    if (dadosClienteDiv ) {
        dadosClienteDiv .addEventListener('click', function(event) {
            event.preventDefault();
            const cpf = document.getElementById('cpf').value.trim();
            if (cpf) {
                buscarDadosPorCpf(cpf);
            }
        });
    }
});

async function buscarDadosPorCpf(cpf) {
    try {
        const response = await fetch(`/buscar/dados?cpf_cliente=${cpf}`);
        const dataResponse = await response.json();
        mostrarDados(dataResponse);
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        document.getElementById('dadosCliente').innerHTML = 'Erro ao buscar dados. Por favor, tente novamente.';
    }
}

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
                mostrarDados(data);
            } else {
                alert('Dados não encontrados para este CPF.');
            }
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            alert('Erro ao buscar dados. Por favor, tente novamente.');
        }
    }
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

// ....
var chamarcpf = "";

// Função para buscar dados por CPF


/*
async function buscarDadosPorCpf(cpf) {
    try {
        const response = await fetch(`/visualizarapagar/dados?cpf_cliente=${cpf}`);
        const data = await response.json();
        if (data.length > 0) {
            mostrarDados(data[0]);
        } else {
            alert('Dados não encontrados para este CPF.');
        }
    } catch (error) {
    }
}*/
//Faz a busca do cpf para alteração
document.addEventListener('DOMContentLoaded', function() {
    const linkAlterarDados = document.querySelector('a[href="#"][onclick="showPage(\'alterardados\')"]');
    if (linkAlterarDados) {
        linkAlterarDados.addEventListener('click', function(event) {
            event.preventDefault();
            const cpf = document.getElementById('cpf').value.trim();
            if (cpf) {
                buscarDadosPorCpfAlterar(cpf);
            }
        });
    }
});

async function buscarDadosPorCpfAlterar(cpf) {
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


function mostrarFormularioEdicao(item) {
    const formularioEdicaoDiv = document.getElementById('formularioEdicao');
    formularioEdicaoDiv.style.display = 'block';

    formularioEdicaoDiv.innerHTML = `
        <h2>Atualizar Cliente</h2>
       
        <form id="formAtualizar" class="dados-form">

           <label>Nome: <span>${item.nome_sobrenome}</span></label><br>
            <input type="hidden" name="nome_sobrenome" value="${item.nome_sobrenome}">
            <label>CPF: <span>${item.cpf_cliente}</span></label><br>
            <input type="hidden" name="cpf_cliente" value="${item.cpf_cliente}">
            <label>Data de Nascimento: <span>${item.data_nascimento}</span></label><br>
            <input type="hidden" name="data_nascimento" value="${item.data_nascimento}">

            <label>Email: <input type="text" name="email_cliente" placeholder="${item.email_cliente}"></label><br>
           <label>Bairro: <input type="text" name="bairro_cliente" placeholder="${item.bairro_cliente}"></label><br>
            <label>Rua: <input type="text" name="rua_cliente" placeholder="${item.rua_cliente}"></label><br>
            <label>Número: <input type="text" name="numero_cliente" placeholder="${item.numero_cliente}"></label><br>
            <label>Cidade: <input type="text" name="cidade_cliente" placeholder="${item.cidade_cliente}"></label><br>
            <label>Estado: <input type="text" name="estado_cliente" placeholder="${item.estado_cliente}"></label><br>
            <label>CEP: <input type="text" name="cep_cliente" placeholder="${item.cep_cliente}"></label><br>
            
            <input type="hidden" name="senha_usuario" value="${item.senha_usuario}">


            <input type="hidden" name="valor_usuario" value="${item.valor_usuario}">

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

//Modal e login
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
        }
    } catch (err) {
        document.getElementById('result').innerText = 'Erro ao fazer login';
    }
});



//Manipulação das section e visualização

function updateUserInterface(user) {
    // Remover link de login
    const loginLink = document.getElementById('loginLink');
    loginLink.style.display = 'none';
    const criarContaLink = document.getElementById('criarContaLink');
    criarContaLink.style.display = 'none';

    // Mostrar nome e CPF do usuário
    const userName = document.getElementById('userName');
    const userCPF = document.getElementById('userCPF');
    userName.innerText = `${user.nome_usuario}`;
    userCPF.innerText = `CPF: ${user.cpf_cliente}`;

    // Mostrar links de "Visualizar e Apagar" e "Alterar Dados"
    const visualizarApagarLink = document.getElementById('visualizarApagarLink');
    const alterarDadosLink = document.getElementById('alterarDadosLink');
    visualizarApagarLink.classList.remove('hidden');
    alterarDadosLink.classList.remove('hidden');

    const visualizarApagarLink1 = document.getElementById('visualizarApagarLink1');
    visualizarApagarLink1.classList.remove('hidden');

    
}

function showPage(pageId) {
    // Implemente a lógica para exibir a página desejada
    console.log(`Mostrando página: ${pageId}`);
}


function displayUserData(user) {
    const loginSection = document.getElementById('login');
    loginSection.innerHTML = `
        <h2>Dados do Usuário</h2>
        <p><strong>Nome:</strong> ${user.nome_usuario}</p>
        <p><strong>CPF:</strong> ${user.cpf_cliente}</p>
    `;
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

document.addEventListener('DOMContentLoaded', function() {
    const homeLink = document.getElementById('homeLink');
    const criarContaLink = document.getElementById('criarContaLink');
    const homeSection = document.getElementById('home');
    const criarContaSection = document.getElementById('criarConta');

    homeLink.addEventListener('click', function() {
        homeSection.style.display = 'block';
        criarContaSection.style.display = 'none';
    });

    criarContaLink.addEventListener('click', function() {
        homeSection.style.display = 'none';
        criarContaSection.style.display = 'block';
    });
});








$(document).ready(function() {
    let imagemIndex = 0;
    let imagensArray = [];

    // Função para mostrar apenas um section por vez
    function mostrarSection(sectionId) {
        $('section').each(function() {
            if ($(this).attr('id') === sectionId) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }

    // Função para formatar as informações do produto
    function formatarDetalhes(produto) {
        return `
            <p>Nome: ${produto.nome}</p>
            <p>Valor: R$ ${produto.valor}</p>
            <p>ID: ${produto.id}</p>
            <p>Código: ${produto.codigo}</p>
        `;
    }

    // Função para exibir a imagem atual do carrossel
    function mostrarImagemAtual() {
        if (imagensArray.length > 0) {
            $('#imagem-atual').attr('src', imagensArray[imagemIndex]);
        }
    }

    // Evento para mostrar a próxima imagem
    $('#next').on('click', function() {
        if (imagemIndex < imagensArray.length - 1) {
            imagemIndex++;
        } else {
            imagemIndex = 0; // Voltar para a primeira imagem
        }
        mostrarImagemAtual();
    });

    // Evento para mostrar a imagem anterior
    $('#prev').on('click', function() {
        if (imagemIndex > 0) {
            imagemIndex--;
        } else {
            imagemIndex = imagensArray.length - 1; // Ir para a última imagem
        }
        mostrarImagemAtual();
    });

    // Fazendo a requisição AJAX para obter os dados dos produtos
    $.ajax({
        url: 'http://localhost:3000/api/produtomongo', // Atualize a URL conforme necessário
        method: 'GET',
        success: function(response) {
            // Se a requisição for bem-sucedida, exibe os produtos na página
            if (response && response.length > 0) {
                let produtosHtml = '';
                response.forEach(produto => {
                    produtosHtml += `
                        <div class="produto">
                            <img src="${produto.imagemhome}" alt="${produto.nome}">
                            <div>
                                <h2 data-id="${produto.id}">${produto.nome}</h2>
                                <p class="valor-produto" data-id="${produto.id}">R$ ${produto.valor}</p>
                            </div>
                        </div>
                    `;
                });
                $('#produtos').html(produtosHtml);

                // Evento de clique para exibir os detalhes do produto e ocultar a lista de produtos
                $(document).on('click', 'h2', function() {
                    // Obter o produto clicado
                    let produtoClicado = response.find(produto => produto.id === $(this).attr('data-id'));

                    // Exibir os detalhes do produto correspondente e ocultar a lista de produtos
                    $('#detalhes').html(formatarDetalhes(produtoClicado));
                    imagensArray = produtoClicado.imagemarray;
                    imagemIndex = 0;
                    mostrarImagemAtual();
                    mostrarSection('visualizarapagar2');
                });
            } else {
                $('#produtos').html('<p>Nenhum produto encontrado.</p>');
            }
        },
        error: function(xhr, status, error) {
            // Em caso de erro na requisição
            $('#produtos').html('<p>Erro ao carregar os produtos.</p>');
            console.error(error);
        }
    });

    // Evento de clique para redirecionar para a página de detalhes do produto
    $(document).on('click', 'p.valor-produto', function() {
        // Obter o ID do produto clicado
        let produtoId = $(this).attr('data-id');

        // Redirecionar para a página produto2.html com o ID do produto como parâmetro
        window.location.href = `produto2.html?id=${produtoId}`;
    });

    // Evento de clique para voltar para a página de produtos
    $('#voltar').on('click', function() {
        mostrarSection('home');
    });
});


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('add-imagemarray').addEventListener('click', function() {
        const container = document.getElementById('imagemarray-container');
        const newInput = document.createElement('input');
        newInput.setAttribute('type', 'text');
        newInput.setAttribute('name', 'imagemarray[]');
        newInput.classList.add('imagemarray');
        container.appendChild(newInput);
        container.appendChild(document.createElement('br'));
        container.appendChild(document.createElement('br'));
    });

    document.getElementById('form-inserir-produto').addEventListener('submit', async function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());

        // Coletar os valores de imagemarray corretamente
        data.imagemarray = formData.getAll('imagemarray[]');

        try {
            const response = await fetch('/api/dadosmongo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (response.ok) {
                alert('Produto inserido com sucesso!');
            } else {
                alert('Erro ao inserir produto: ' + result.message);
            }
        } catch (error) {
            alert('Erro ao enviar solicitação: ' + error.message);
        }
    });
});
