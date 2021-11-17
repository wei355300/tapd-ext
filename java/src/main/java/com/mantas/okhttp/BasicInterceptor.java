package com.mantas.okhttp;

import lombok.extern.slf4j.Slf4j;
import okhttp3.Credentials;
import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;
import org.jetbrains.annotations.NotNull;

import java.io.IOException;

@Slf4j
public class BasicInterceptor implements Interceptor {

    private final static String NAME = "Authorization";

    private String credentials;

    public BasicInterceptor(String name, String password) {
        setCredentials(name, password);
    }

    @NotNull
    @Override
    public Response intercept(Chain chain) throws IOException {
        Request request = chain.request().newBuilder().header(NAME, credentials).build();
        Response response = chain.proceed(request);
        return response;
    }

    private void setCredentials(String name, String password) {
        this.credentials = Credentials.basic(name, password);
    }
}
