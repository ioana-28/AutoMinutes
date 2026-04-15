package org.server.backend.service;

import org.server.backend.model.ActionItem;
import org.server.backend.model.Summary;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class ResultService {

	public Summary getSummary(Long transcriptId) {
		return null;
	}

	public List<ActionItem> getActions(Long transcriptId) {
		return Collections.emptyList();
	}
}
