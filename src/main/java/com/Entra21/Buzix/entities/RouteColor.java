package com.Entra21.Buzix.entities;

public enum RouteColor {
    BLUE("#0000FF"),
    RED("#FF0000"),
    GREEN("#008000"),
    YELLOW("#FFFF00"),
    ORANGE("#FFA500"),
    PURPLE("#800080");

    private final String code;

    RouteColor(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}
