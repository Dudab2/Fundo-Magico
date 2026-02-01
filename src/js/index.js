document.addEventListener("DOMContentLoaded", function(){
    // 1. No javaScript, pegar o evento de submit do formulário para evitar o recarregamento da página.
    const formulario = document.querySelector(".form-group");
    const descricaoInput = document.getElementById("description");
    const codigoHtml = document.getElementById("html-code");
    const codigoCss = document.getElementById("css-code");
    const secaoPreview = document.getElementById("preview-section");

    formulario.addEventListener("submit", async function(evento){
        evento.preventDefault(); // Evita o carregamento da página

        // 2. Obter o valor digitado pelo usuário no campo de texto.
        const descricao = descricaoInput.value.trim();

        if(!descricao){
            return;
        }

        // 3.Exibir um indicador de carregamento enquanto a requisição está sendo processada.

        mostarCarregamento(true);

        // 4. Fazer uma requisição HTTP (POST) para a API do n8n, enviando o texto do formulário  no corpo da requisição em formato JSON.
        try{
            const resposta = await fetch("https://dudab2bl.app.n8n.cloud/webhook/fundo-magico", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ descricao })
            });
            const dados = await resposta.json();

            codigoHtml.textContent = dados.html || "";
            codigoCss.textContent = dados.css || "";

            secaoPreview.style.display = "block";
            secaoPreview.innerHTML = dados.html || "";

            let tagEstilo = document.getElementById("estilo-dinamico");
            if(tagEstilo){
                tagEstilo.remove();
            }

            if(dados.css){
                tagEstilo = document.createElement("style");
                tagEstilo.id = "estilo-dinamico";
                tagEstilo.textContent = dados.css;
                document.head.appendChild(tagEstilo);
            }
    

        }catch(error){
            console.error("Erro ao enviar a requisição:", error);
            codigoHtml.textContent = "Não consegui gerar o HTML, tente novamente."
            codigoCss.textContent = "Não consegui gerar o CSS, tente novamente."
        }finally{
            mostarCarregamento(false);
        }
    });

    function mostarCarregamento(estarCarregando) {
        const botaoEnviar = document.getElementById('generate-btn');
        if(estarCarregando){
            botaoEnviar.textContent = "Carregando Background...";
        }else{
            botaoEnviar.textContent = "Gerar background Mágico";
        }
    }
});