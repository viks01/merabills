package com.function;

import com.microsoft.azure.functions.*;
import com.microsoft.azure.functions.annotation.*;
import java.util.Optional;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.BufferedReader;
import java.io.InputStreamReader;

public class GetLocation {
    private static final String API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your actual API key

    @FunctionName("GetLocation")
    public HttpResponseMessage run(
        @HttpTrigger(name = "req", methods = {HttpMethod.GET, HttpMethod.POST}, authLevel = AuthorizationLevel.FUNCTION)
        HttpRequestMessage<Optional<String>> request,
        final ExecutionContext context) {

        String country = request.getQueryParameters().get("country");
        String state = request.getQueryParameters().get("state");
        String area = request.getQueryParameters().get("area");

        if (country == null || state == null || area == null) {
            return request.createResponseBuilder(HttpStatus.BAD_REQUEST)
                    .body("Please provide country, state, and area parameters")
                    .build();
        }

        String address = String.format("%s, %s, %s", area, state, country);
        String response = getGeocodingData(address);

        return request.createResponseBuilder(HttpStatus.OK).body(response).build();
    }

    private String getGeocodingData(String address) {
        try {
            String urlStr = String.format("https://maps.googleapis.com/maps/api/geocode/json?address=%s&key=%s",
                    address.replace(" ", "%20"), API_KEY);
            URL url = new URL(urlStr);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");

            BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String inputLine;
            StringBuilder content = new StringBuilder();
            while ((inputLine = in.readLine()) != null) {
                content.append(inputLine);
            }
            in.close();
            conn.disconnect();
            return content.toString();
        } catch (IOException e) {
            return "{\"error\": \"Unable to get geocoding data.\"}";
        }
    }
}
