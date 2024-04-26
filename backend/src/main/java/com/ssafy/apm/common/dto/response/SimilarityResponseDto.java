package com.ssafy.apm.common.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SimilarityResponseDto implements Comparable<SimilarityResponseDto>{
    String value;
    Double rate;

    @Override
    public int compareTo(SimilarityResponseDto o){
        return this.rate.compareTo(o.rate);
    }
}
