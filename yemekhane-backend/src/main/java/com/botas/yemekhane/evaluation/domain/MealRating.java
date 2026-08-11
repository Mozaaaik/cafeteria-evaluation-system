package com.botas.yemekhane.evaluation.domain;

import java.time.Instant;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import com.botas.yemekhane.menu.domain.MenuItem;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "meal_ratings", uniqueConstraints = @UniqueConstraint(columnNames = {"evaluation_id", "menu_item_id"}))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MealRating {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "evaluation_id", nullable = false)
    private MenuEvaluation evaluation;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "menu_item_id", nullable = false)
    private MenuItem menuItem;
    @Column(nullable = false, columnDefinition = "TINYINT") private int score;
    @CreationTimestamp @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
    @UpdateTimestamp @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public static MealRating create(MenuItem item, int score) {
        MealRating rating = new MealRating(); rating.menuItem = item; rating.score = score; return rating;
    }
    void attachTo(MenuEvaluation evaluation) { this.evaluation = evaluation; }
}
