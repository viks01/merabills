package com.function;

import com.microsoft.azure.functions.*;
import com.microsoft.azure.functions.annotation.*;
import java.util.Optional;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.BufferedReader;
import java.io.InputStreamReader;

public class GetAddress {
    private static final String API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your actual API key

    @FunctionName("GetAddress")
    public HttpResponseMessage run(
        @HttpTrigger(name = "req", methods = {HttpMethod.GET, HttpMethod.POST}, authLevel = AuthorizationLevel.FUNCTION)
        HttpRequestMessage<Optional<String>> request,
        final ExecutionContext context) {

        String latitude = request.getQueryParameters().get("latitude");
        String longitude = request.getQueryParameters().get("longitude");

        if (latitude == null || longitude == null) {
            return request.createResponseBuilder(HttpStatus.BAD_REQUEST)
                    .body("Please provide latitude and longitude parameters")
                    .build();
        }

        String response = getReverseGeocodingData(latitude, longitude);

        return request.createResponseBuilder(HttpStatus.OK).body(response).build();
    }

    private String getReverseGeocodingData(String latitude, String longitude) {
        try {
            String urlStr = String.format("https://maps.googleapis.com/maps/api/geocode/json?latlng=%s,%s&key=%s",
                    latitude, longitude, API_KEY);
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
            return "{\"error\": \"Unable to get reverse geocoding data.\"}";
        }
    }
}
