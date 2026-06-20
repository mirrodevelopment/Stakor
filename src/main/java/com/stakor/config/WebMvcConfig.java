package com.stakor.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("forward:/index.html");
        registry.addViewController("/universe").setViewName("forward:/Universe.Html");
        registry.addViewController("/assessment").setViewName("forward:/assessment.html");
        registry.addViewController("/subscribe").setViewName("forward:/subscription.html");
        registry.addViewController("/collections").setViewName("forward:/collections.html");
        registry.addViewController("/login").setViewName("forward:/Login-Stk/Login.html");
    }
}
