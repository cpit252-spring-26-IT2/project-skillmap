package com.skillmap.facade;

import com.skillmap.model.RoadmapData;
import com.skillmap.model.RoadmapRequest;
import com.skillmap.service.RoadmapService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class RoadmapGenerationFacade {

    private static final Logger logger = LoggerFactory.getLogger(RoadmapGenerationFacade.class);
    
    private final RoadmapService roadmapService;

    public RoadmapGenerationFacade(RoadmapService roadmapService) {
        this.roadmapService = roadmapService;
    }

    /**
     * Facade method that hides the complexity of creating a roadmap.
     * It handles the request, logs the event, and uses the service
     * (which internally uses the Factory) to return the final data.
     */
    public RoadmapData generateVerifiedTemplate(String field, String track, String specialization) {
        logger.info("Facade received request for template: field={}, track={}, specialization={}", 
                field, track, specialization);
                
        RoadmapRequest request = new RoadmapRequest(field, track, specialization);
        
        try {
            RoadmapData result = roadmapService.generate(request);
            logger.info("Successfully generated template with {} skills and {} certifications.", 
                    result.skills().size(), result.certifications().size());
            return result;
        } catch (Exception e) {
            logger.error("Failed to generate template through Facade: {}", e.getMessage());
            throw e; // Let the global exception handler catch it
        }
    }
}
