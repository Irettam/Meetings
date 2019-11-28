/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package clases;

import java.io.File;
import java.io.FileInputStream;
import java.util.Iterator;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

/**
 *
 * @author Tomas
 */
public class Excel {

    public static void main(String[] args) {
        String nombreArchivo = "Clientes.xlsx";
        String rutaArchivo = "C:\\Users\\Antonio\\Desktop\\" + nombreArchivo;
        String hoja = "Hoja1";

        try (FileInputStream file = new FileInputStream(new File(rutaArchivo))) {
            // leer archivo excel
            XSSFWorkbook worbook = new XSSFWorkbook(file);
            //obtener la hoja que se va leer
            XSSFSheet sheet = worbook.getSheetAt(0);
            //obtener todas las filas de la hoja excel
            Iterator<Row> rowIterator = sheet.iterator();

            Row row;
            // se recorre cada fila hasta el final
            row = rowIterator.next();
            while (rowIterator.hasNext()) {
                row = rowIterator.next();
                //se obtiene las celdas por fila
                Iterator<Cell> cellIterator = row.cellIterator();
                Cell cell;
                //se recorre cada celda
                //while (cellIterator.hasNext()) {
                // se obtiene la celda en específico y se la imprime
                Clientes cliente = new Clientes();
                cell = cellIterator.next();
                cliente.setUsuario(cell.getStringCellValue());
                cell = cellIterator.next();
                cliente.setNombre(cell.getStringCellValue());
                cell = cellIterator.next();
                cliente.setContrasena(cell.getStringCellValue());
                cell = cellIterator.next();
                cliente.setContacto(cell.getStringCellValue());
                cell = cellIterator.next();
                cliente.setPais(cell.getStringCellValue());
                cell = cellIterator.next();
                cliente.setMail(cell.getStringCellValue());
                cell = cellIterator.next();
                //cliente.set
                //cell.getNumericCellValue()
                System.out.print(cliente.getContacto());
                cliente.GuardarExcel();
                //}
                System.out.println();
            }
        } catch (Exception e) {
            e.getMessage();
        }
    }
}
