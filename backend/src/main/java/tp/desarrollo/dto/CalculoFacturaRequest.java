package tp.desarrollo.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;



public class CalculoFacturaRequest {
        @JsonProperty("estadiaId")
    private Long estadiaId;
    
    @JsonProperty("huespedId")
    private Long huespedId;

    private Long responsableId;
    
    private List<Long> idsConsumosSeleccionados;

    public CalculoFacturaRequest() {
    }

    public void setEstadiaId(Long estadiaId) {
        this.estadiaId = estadiaId;
    }
    
    public void setHuespedId(Long huespedId) {
        this.huespedId = huespedId;

    }
    public void setResponsableId(Long responsableId){
        this.responsableId = responsableId;
    }
    public void setIdsConsumosSeleccionados(List<Long> idsConsumosSeleccionados){
        this.idsConsumosSeleccionados = idsConsumosSeleccionados;
    }

    public Long getEstadiaId() {
        return estadiaId;
    }
    public Long getResponsableId(){
        return responsableId;
    }
    public Long getHuespedId() {
        return huespedId;
    }
    public List<Long> getIdsConsumosSeleccionados(){
        return idsConsumosSeleccionados;
    }
}