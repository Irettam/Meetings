/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package clases;

import db.Tabla;
import java.sql.ResultSet;
import java.util.Date;

/**
 *
 * @author Tomas
 */
public class Mesas {
    private int id;
    private String horario_inicio;
    private String horario_final;
    private boolean ocupado;
    private int numero;
    private String dia;
    private int id_lugar;
    private final static String tabla = "mesas";

    public Mesas(int id, String horario_inicio, String horario_final, boolean ocupado, int numero, String dia, int id_lugar) {
        this.id = id;
        this.horario_inicio = horario_inicio;
        this.horario_final = horario_final;
        this.ocupado = ocupado;
        this.numero = numero;
        this.dia = dia;
        this.id_lugar = id_lugar;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getHorario_inicio() {
        return horario_inicio;
    }

    public void setHorario_inicio(String horario_inicio) {
        this.horario_inicio = horario_inicio;
    }

    public String getHorario_final() {
        return horario_final;
    }

    public void setHorario_final(String horario_final) {
        this.horario_final = horario_final;
    }

    public boolean isOcupado() {
        return ocupado;
    }

    public void setOcupado(boolean ocupado) {
        this.ocupado = ocupado;
    }

    public int getNumero() {
        return numero;
    }

    public void setNumero(int numero) {
        this.numero = numero;
    }

    public String getDia() {
        return dia;
    }

    public void setDia(String dia) {
        this.dia = dia;
    }

    public int getId_lugar() {
        return id_lugar;
    }

    public void setId_lugar(int id_lugar) {
        this.id_lugar = id_lugar;
    }
    
   
    public static int insert(int id, String horario_inicio, String horario_final, boolean ocupado, int numero, String dia, int id_lugar) {
        String campos = "id,horario_inicio,horario_final,ocupado,numero,dia,id_lugar";
        String valores = id + ",'" + horario_inicio + "','" + horario_final + "'," + ocupado + "," + numero + ",'" + dia + "'," + id_lugar;
        return Tabla.insert(tabla, campos, valores);
    }
    
    public static int insertSeveral(int id, String horario_inicio, String horario_final, boolean ocupado, int numero, String dia, int id_lugar) {
        String campos = "id,horario_inicio,horario_final,ocupado,numero,dia,id_lugar";
        String valores = id + ",'" + horario_inicio + "','" + horario_final + "'," + ocupado + "," + numero + ",'" + dia + "'," + id_lugar;
        return Tabla.insertSeveral(tabla, campos, valores);
    }

    public void Guardar() {
        Mesas.insert(this.id, this.horario_inicio, this.horario_final, this.ocupado, this.numero, this.dia, this.id_lugar);
    }
    
    public void GuardarMuchos() {
        Mesas.insertSeveral(this.id, this.horario_inicio, this.horario_final, this.ocupado, this.numero, this.dia, this.id_lugar);
    }

    public static int updateAll(int id, String horario_inicio, String horario_final, boolean ocupado, int numero, String dia, int id_lugar) {
        String campos = "id<>horario_inicio<>horario_final<>ocupado<>numero<>dia<>id_lugar";
        String valores = id + "<>'" + horario_inicio + "'<>'" + horario_final + "'<>" + ocupado + "<>" + numero + "<>'" + dia + "'," + id_lugar;
        return Tabla.updateAll(tabla, id, campos, valores);
    }

    public static int delete(int id) {
        return Tabla.delete(tabla, id);
    }

    public static int update(int id, String campo, String valor) {
        return Tabla.update(tabla, id, campo, valor);
    }

    public static ResultSet select() {
        return Tabla.select(tabla);
    }
    
}
