document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtenção de Elementos: Limpa e organizada no início.
    const nameInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const generateBtn = document.getElementById('generateBtn');
    const birthdayMessageOutput = document.getElementById('birthdayMessage');
    const copyBtn = document.getElementById('copyBtn');
    const sendEmailBtn = document.getElementById('sendEmailBtn');

    // Elementos para exibir mensagens de erro
    const nameError = document.getElementById('nomeError');
    const emailError = document.getElementById('emailError');

    // Elemento para feedback de cópia
    const copyFeedback = document.getElementById('copyFeedback');

    // 2. Funções de Utilidade para Mensagens de Erro e Estado de Botões

    /**
     * Exibe uma mensagem de erro abaixo de um campo.
     * @param {HTMLElement} element O elemento span onde a mensagem será exibida.
     * @param {string} message A mensagem de erro a ser mostrada.
     */
    const showError = (element, message) => {
        element.textContent = message;
    };

    /**
     * Limpa a mensagem de erro de um campo.
     * @param {HTMLElement} element O elemento span a ser limpo.
     */
    const clearError = (element) => {
        element.textContent = '';
    };

    /**
     * Habilita ou desabilita os botões de Copiar e Enviar E-mail
     * com base na existência de uma mensagem gerada.
     */
    const toggleActionButtons = () => {
        const hasMessage = birthdayMessageOutput.value.trim().length > 0;
        copyBtn.disabled = !hasMessage;
        sendEmailBtn.disabled = !hasMessage;
    };

    // 3. Listener para o Botão Gerar Mensagem
    generateBtn.addEventListener('click', () => {
        let formIsValid = true; // Flag para controlar a validade do formulário

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();

        // Limpa quaisquer erros anteriores ao tentar gerar uma nova mensagem
        clearError(nameError);
        clearError(emailError);

        // Validação do campo Nome
        if (!name) {
            showError(nameError, 'Por favor, insira o nome do aniversariante.');
            formIsValid = false;
        }

        // Validação do campo Email
        if (!email) {
            showError(emailError, 'Por favor, insira o email acadêmico.');
            formIsValid = false;
        } else {
            // Validação de formato de email genérico
            const genericEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!genericEmailRegex.test(email)) {
                showError(emailError, 'Formato de email inválido (ex: nome@exemplo.com).');
                formIsValid = false;
            } else if (!email.endsWith('@eniac.edu.br')) { // <-- MUDANÇA AQUI!
                // Validação específica para o domínio ENIAC
                showError(emailError, 'O email deve ser da ENIAC (ex: nome@eniac.edu.br).'); // <-- MUDANÇA AQUI NA MENSAGEM!
                formIsValid = false;
            }
        }

        // Se alguma validação falhou, impede a geração da mensagem e desabilita botões
        if (!formIsValid) {
            birthdayMessageOutput.value = ''; // Garante que a mensagem antiga seja limpa
            toggleActionButtons();
            return;
        }

        // Conteúdo da Mensagem: Mantido como está, pois está claro e personalizado.
        const message = `Prezado(a) ${name},

Em nome de toda a equipe ENIAC, gostaríamos de desejar a você um **Feliz Aniversário** muito especial!

Que este novo ano de vida seja repleto de muitas alegrias, saúde, sucesso e novas conquistas, tanto em sua jornada pessoal quanto em sua trajetória conosco na ENIAC.

Agradecemos sua dedicação e contribuição. Que você possa celebrar este dia tão importante ao lado de pessoas queridas.

Muitas felicidades e um forte abraço!

Atenciosamente,
A Equipe ENIAC
`;
        birthdayMessageOutput.value = message; // <-- MUDANÇA AQUI NO TEXTO DA MENSAGEM TAMBÉM!
        toggleActionButtons(); // Habilita os botões após gerar a mensagem com sucesso

        // Opcional: Focar no textarea após gerar a mensagem para facilitar a cópia
        // birthdayMessageOutput.focus();
    });

    // 4. Listener para o Botão Copiar Mensagem
    copyBtn.addEventListener('click', async () => {
        // Verifica se há alguma mensagem para copiar
        if (!birthdayMessageOutput.value.trim()) {
            // Este alerta ainda pode ser um fallback caso o botão esteja habilitado indevidamente
            alert('Nenhuma mensagem para copiar. Gere a mensagem primeiro!');
            return;
        }

        try {
            birthdayMessageOutput.select(); // Seleciona o texto no textarea
            birthdayMessageOutput.setSelectionRange(0, 99999); // Para dispositivos móveis

            await navigator.clipboard.writeText(birthdayMessageOutput.value);

            // Mostra o feedback visual de "Copiado!"
            copyFeedback.classList.add('show');
            setTimeout(() => {
                copyFeedback.classList.remove('show');
            }, 2000); // Esconde o feedback após 2 segundos

        } catch (err) {
            console.error('Falha ao copiar a mensagem usando Clipboard API:', err);
            // Fallback para document.execCommand caso a Clipboard API não esteja disponível
            try {
                document.execCommand('copy');
                alert('Mensagem copiada para a área de transferência! (Usando método fallback)');
            } catch (fallbackErr) {
                console.error('Falha ao copiar a mensagem com execCommand:', fallbackErr);
                alert('Erro ao copiar a mensagem. Por favor, tente novamente manualmente.');
            }
        }
    });

    // 5. Listener para o Botão Enviar por E-mail
    sendEmailBtn.addEventListener('click', () => {
        const recipientEmail = emailInput.value.trim();
        const generatedMessage = birthdayMessageOutput.value.trim(); // Pega a mensagem gerada

        // Verifica se há um email para o destinatário E se uma mensagem foi gerada
        if (!recipientEmail || !generatedMessage) {
            alert('Por favor, gere a mensagem antes de tentar enviar por e-mail.');
            return;
        }

        // Assunto do email mais específico, incluindo o nome
        const subject = encodeURIComponent(`Feliz Aniversário para ${nameInput.value.trim()}! - Equipe ENIAC`); // <-- MUDANÇA AQUI NO ASSUNTO!
        const body = encodeURIComponent(generatedMessage); // Usa a mensagem já gerada e codificada

        // Cria o link mailto:
        const mailtoLink = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;

        // Abre o cliente de email padrão do usuário
        window.location.href = mailtoLink;
    });

    // Inicializa o estado dos botões ao carregar a página
    toggleActionButtons();
});