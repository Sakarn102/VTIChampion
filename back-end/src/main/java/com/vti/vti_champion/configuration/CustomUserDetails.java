package com.vti.vti_champion.configuration;

import com.vti.vti_champion.entity.User;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Data
public class CustomUserDetails implements UserDetails {
    private Integer id;
    private String username;
    private String fullName;
    private String email;
    private String avatarUrl;
    private String password;
    private boolean isActive;
    private boolean enabled;
    private Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.fullName = user.getFullname();
        this.avatarUrl = user.getAvatarUrl();
        this.password = user.getPassword();
        this.isActive = user.getIsActive();
        this.authorities = List.of(new SimpleGrantedAuthority(
                "ROLE_" + user.getRole().getName().toUpperCase().trim()));
    }

    // Method cua userdetail
    @Override
    public boolean isEnabled() {
        return this.isActive;
    }

    @Override
    public boolean isAccountNonLocked() {
        // Có thể trả về cùng giá trị enabled để tăng độ bảo mật
        return this.isActive;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public @Nullable String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }
}
