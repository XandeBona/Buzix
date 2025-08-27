package com.Entra21.Buzix.dtos;

public class ChatRequestDTO {
    //Opção escolhida no select
    private String type;

    //Pra buscar os dados do veículo já cadastrado
    private String make;
    private String model;
    private Integer year;
    private String fuelType;

    //Para a troca de óleo
    private String dataOleo;
    private Integer kmOleo;

    //Para a validação dos pneus
    private String dataPneu;
    private Integer kmPneu;

    //Para a revisão geral
    private String dataCompra;

    //Sempre presente
    private Integer kmAtual;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getMake() {
        return make;
    }

    public void setMake(String make) {
        this.make = make;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public String getFuelType() {
        return fuelType;
    }

    public void setFuelType(String fuelType) {
        this.fuelType = fuelType;
    }

    public String getDataOleo() {
        return dataOleo;
    }

    public void setDataOleo(String dataOleo) {
        this.dataOleo = dataOleo;
    }

    public Integer getKmOleo() {
        return kmOleo;
    }

    public void setKmOleo(Integer kmOleo) {
        this.kmOleo = kmOleo;
    }

    public String getDataPneu() {
        return dataPneu;
    }

    public void setDataPneu(String dataPneu) {
        this.dataPneu = dataPneu;
    }

    public Integer getKmPneu() {
        return kmPneu;
    }

    public void setKmPneu(Integer kmPneu) {
        this.kmPneu = kmPneu;
    }

    public String getDataCompra() {
        return dataCompra;
    }

    public void setDataCompra(String dataCompra) {
        this.dataCompra = dataCompra;
    }

    public Integer getKmAtual() {
        return kmAtual;
    }

    public void setKmAtual(Integer kmAtual) {
        this.kmAtual = kmAtual;
    }
}
