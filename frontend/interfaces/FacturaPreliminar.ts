export interface ItemFactura {
    id: number;
    descripcion: string;
    valor: number;
}

export interface FacturaPreliminar {
    nombreResponsable: string;
    tipoDocumento: string;
    numeroDocumento: string;


    items: ItemFactura[];

    subtotalNeto: number; 
    montoIVA: number; 
    totalAPagar: number;  

    tipoFactura: 'A' | 'B'; 
}
