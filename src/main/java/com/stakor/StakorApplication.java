package com.stakor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;

@SpringBootApplication
@ComponentScan(basePackages = "com.stakor", excludeFilters = @ComponentScan.Filter(type = FilterType.REGEX, pattern = "com.stakor.config.*Adapter.*Service"))
public class StakorApplication {

	public static void main(String[] args) {
		SpringApplication.run(StakorApplication.class, args);
	}

}
