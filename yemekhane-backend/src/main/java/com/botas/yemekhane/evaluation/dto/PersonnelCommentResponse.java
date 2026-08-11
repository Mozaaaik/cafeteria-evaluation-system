package com.botas.yemekhane.evaluation.dto;
import java.util.List;
public record PersonnelCommentResponse(String personnelName, List<CommentRatingResponse> ratings,
                                       double averageScore, String generalComment) {}
