async function cadastrarEmMassa(file) {
    if (!file) {
        alert("Selecione um arquivo KMZ!");
        return;
    }

    try {
        const arrayBuffer = await file.arrayBuffer();
        const zip = await JSZip.loadAsync(arrayBuffer);

        //Busca o KML dentro do KMZ
        const kmlFile = Object.keys(zip.files).find(name => name.endsWith(".kml"));
        if (!kmlFile) throw new Error("Nenhum KML encontrado no KMZ!");

        const kmlText = await zip.files[kmlFile].async("text");

        //Converte KML
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(kmlText, "application/xml");

        const placemarks = xmlDoc.getElementsByTagName("Placemark");

        for (let placemark of placemarks) {
            const pointName  = placemark.getElementsByTagName("name")[0]?.textContent;
            const coordsText = placemark.getElementsByTagName("coordinates")[0]?.textContent.trim();

            if (coordsText) {
                //Busca Lon e Lat (se Altitude existir será ignorado)
                const [longitude, latitude] = coordsText.split(",").map(Number);

                await fetch("/busstops/register", {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ identifier: pointName , latitude, longitude })
                });
            }
        }

        alert("Cadastro em massa concluído com sucesso!");

    } catch (err) {
        console.error(err);
        alert("Erro ao processar o arquivo KMZ");
    }
}

function cadastrarPonto() {
    const inputIdentifier = document.getElementById("input_identifier");
    const inputLatitude = document.getElementById("input_latitude");
    const inputLongitude = document.getElementById("input_longitude");

    const identifier = inputIdentifier.value;
    const latitude = inputLatitude.value;
    const longitude = inputLongitude.value;

    if (!identifier || isNaN(latitude) || isNaN(longitude)) {
        alert("Preencha todos os campos corretamente!");
        return;
    }

    fetch("/busstops/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, latitude, longitude })
    })
        .then(res => {
            if (!res.ok) throw new Error("Erro ao cadastrar ponto");
            return res.json();
        })
        .then(() => {
            alert("Ponto cadastrado com sucesso!");
        })
        .catch(err => {
            console.error(err);
            alert("Erro ao cadastrar ponto");
        });

    //Para limpar os campos do formulário
    inputIdentifier.value = "";
    inputLatitude.value = "";
    inputLongitude.value = "";
}

function setupEvents() {
    document.getElementById("form-busStop").addEventListener("submit", function (event) {
        event.preventDefault();
        cadastrarPonto();
    });

    //Para envio em massa
    const fileInput = document.getElementById("file");
    const fileForm = fileInput.closest("form");

    fileForm.addEventListener("submit", function (event) {
        event.preventDefault();
        cadastrarEmMassa(fileInput.files[0]);
    });

    //Mostra o nome do arquivo selecionado
    fileInput.addEventListener("change", function () {
        document.getElementById("file-name").textContent = fileInput.files[0]?.name || "Nenhum arquivo escolhido";
    });
}


window.addEventListener("load", setupEvents);