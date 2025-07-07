package com.sarahpilates.util;

import java.text.Normalizer;
import java.util.regex.Pattern;

public class StringUtils {
    
    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");
    
    public static String removeAccents(String input) {
        if (input == null) return null;
        
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        return NONLATIN.matcher(normalized).replaceAll("");
    }
    
    public static String slugify(String input) {
        if (input == null) return null;
        
        String nowhitespace = WHITESPACE.matcher(input).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("");
        return slug.toLowerCase();
    }
    
    public static String formatCPF(String cpf) {
        if (cpf == null) return null;
        
        cpf = cpf.replaceAll("[^0-9]", "");
        if (cpf.length() != 11) return cpf;
        
        return cpf.substring(0, 3) + "." + 
               cpf.substring(3, 6) + "." + 
               cpf.substring(6, 9) + "-" + 
               cpf.substring(9, 11);
    }
    
    public static String formatPhone(String phone) {
        if (phone == null) return null;
        
        phone = phone.replaceAll("[^0-9]", "");
        
        if (phone.length() == 10) {
            return "(" + phone.substring(0, 2) + ") " + 
                   phone.substring(2, 6) + "-" + 
                   phone.substring(6, 10);
        } else if (phone.length() == 11) {
            return "(" + phone.substring(0, 2) + ") " + 
                   phone.substring(2, 7) + "-" + 
                   phone.substring(7, 11);
        }
        
        return phone;
    }
    
    public static boolean isNullOrEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }
    
    public static boolean isNotNullOrEmpty(String str) {
        return !isNullOrEmpty(str);
    }
    
    public static String capitalize(String str) {
        if (isNullOrEmpty(str)) return str;
        
        return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
    }
    
    public static String capitalizeWords(String str) {
        if (isNullOrEmpty(str)) return str;
        
        String[] words = str.split("\\s+");
        StringBuilder result = new StringBuilder();
        
        for (int i = 0; i < words.length; i++) {
            if (i > 0) result.append(" ");
            result.append(capitalize(words[i]));
        }
        
        return result.toString();
    }
}