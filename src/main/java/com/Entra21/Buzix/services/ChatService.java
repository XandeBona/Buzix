package com.Entra21.Buzix.services;

import com.Entra21.Buzix.dtos.ChatRequestDTO;
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.ChatModel;
import com.openai.models.chat.completions.ChatCompletion;
import com.openai.models.chat.completions.ChatCompletionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


@Service
public class ChatService {

    private final OpenAIClient client;

    public ChatService(@Value("${openai.api.key}") String apiKey) {
        this.client = OpenAIOkHttpClient.builder()
                .apiKey(apiKey)
                .build();
    }

    public String askChat(ChatRequestDTO req) {
        String prompt = buildPrompt(req);

        ChatCompletionCreateParams params = ChatCompletionCreateParams.builder()
                .model(ChatModel.GPT_4_1)
                .addUserMessage(prompt)
                .build();

        ChatCompletion resp = client.chat().completions().create(params);

        return resp.choices().get(0).message().content().orElse("Sem resposta do ChatGPT");
    }

    private String buildPrompt(ChatRequestDTO req) {
        StringBuilder sb = new StringBuilder();
        sb.append("Sou dono de um veículo ")
                .append(req.getMake()).append(" ")
                .append(req.getModel()).append(" ")
                .append(req.getYear())
                .append(" (combustível: ").append(req.getFuelType()).append("). ");

        switch (req.getType()) {
            case "troca_oleo":
                sb.append("A última troca de óleo foi em ")
                        .append(req.getDataOleo())
                        .append(" com ")
                        .append(req.getKmOleo()).append(" km. ")
                        .append("O carro está atualmente com ")
                        .append(req.getKmAtual()).append(" km. ")
                        .append("Quando devo fazer a próxima troca de óleo? Responda de forma objetiva, com no máximo 5 linhas. Não mande palavras em negrito ou com itálico ou textos decorativos. Se houver resposta com data, retornar no padrão DD/MM/YY");
                break;

            case "pneus":
                sb.append("A última troca/revisão de pneus foi em ")
                        .append(req.getDataPneu())
                        .append(" com ")
                        .append(req.getKmPneu()).append(" km. ")
                        .append("O carro está atualmente com ")
                        .append(req.getKmAtual()).append(" km. ")
                        .append("Preciso trocar os pneus? Responda de forma objetiva, com no máximo 5 linhas. Não mande palavras em negrito ou com itálico ou textos decorativos. Se houver resposta com data, retornar no padrão DD/MM/YY");
                break;

            case "revisao_geral":
                sb.append("Comprei o carro em ")
                        .append(req.getDataCompra())
                        .append(" e ele está atualmente com ")
                        .append(req.getKmAtual()).append(" km. ")
                        .append("Quais manutenções preventivas devo realizar agora? Responda em tópicos, de forma objetiva, com no máximo 6 tópicos. Não mande palavras em negrito ou com itálico ou textos decorativos. Se houver resposta com data, retornar no padrão DD/MM/YY");
                break;
        }

        return sb.toString();
    }
}