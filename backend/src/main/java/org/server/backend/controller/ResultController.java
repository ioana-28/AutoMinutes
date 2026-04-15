package org.server.backend.controller;

import org.server.backend.model.ActionItem;
import org.server.backend.model.Summary;
import org.server.backend.service.ResultService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/results")
public class ResultController {

    private final ResultService resultService;

    public ResultController(ResultService resultService) {
        this.resultService = resultService;
    }

    // Get summary
    @GetMapping("/{transcriptId}/summary")
    public Summary getSummary(@PathVariable Long transcriptId) {
        return resultService.getSummary(transcriptId);
    }

    // Get action items
    @GetMapping("/{transcriptId}/actions")
    public List<ActionItem> getActions(@PathVariable Long transcriptId) {
        return resultService.getActions(transcriptId);
    }
}