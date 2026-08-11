package com.botas.yemekhane.evaluation.domain;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import com.botas.yemekhane.menu.domain.DailyMenu;
import com.botas.yemekhane.user.domain.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "menu_evaluations", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "menu_id"}))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MenuEvaluation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "menu_id", nullable = false)
    private DailyMenu menu;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @Column(name = "general_comment", length = 500)
    private String generalComment;
    @OneToMany(mappedBy = "evaluation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MealRating> ratings = new ArrayList<>();
    @CreationTimestamp @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
    @UpdateTimestamp @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public static MenuEvaluation create(DailyMenu menu, User user) {
        MenuEvaluation evaluation = new MenuEvaluation();
        evaluation.menu = menu;
        evaluation.user = user;
        return evaluation;
    }
    public void update(String comment, List<MealRating> newRatings) {
        generalComment = comment == null || comment.isBlank() ? null : comment.trim();
        ratings.clear();
        newRatings.forEach(rating -> { rating.attachTo(this); ratings.add(rating); });
    }
}
