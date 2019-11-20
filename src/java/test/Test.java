/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package test;

import clases.Lugar;
import java.sql.ResultSet;

/**
 *
 * @author Tomas
 */
public class Test {
    public static void main(String[] args) {
        System.out.println("Empiezo");
        ResultSet rs = Lugar.select();
        System.out.println("Final");
    }
}
