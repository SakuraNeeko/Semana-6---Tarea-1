import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UnidadmedidaService } from '../../Services/unidadmedida.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editarunidadmedida',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './editarunidadmedida.component.html',
  styleUrls: ['./editarunidadmedida.component.scss']
})
export class EditarUnidadmedidaComponent implements OnInit {
  frm_UnidadMedida: FormGroup;
  idUnidadMedida: number;

  constructor(
    private unidadService: UnidadmedidaService,
    private route: ActivatedRoute,
    private navegacion: Router
  ) {}

  ngOnInit(): void {
    this.idUnidadMedida = Number(this.route.snapshot.paramMap.get('id'));
    this.frm_UnidadMedida = new FormGroup({
      Detalle: new FormControl('', [Validators.required]),
      Tipo: new FormControl('', [Validators.required])
    });

    this.unidadService.uno(this.idUnidadMedida).subscribe((unidad) => {
      this.frm_UnidadMedida.patchValue({
        Detalle: unidad.Detalle,
        Tipo: unidad.Tipo
      });
    });
  }

  actualizar() {
    const unidadActualizada = {
      idUnidad_Medida: this.idUnidadMedida,
      Detalle: this.frm_UnidadMedida.get('Detalle')?.value,
      Tipo: this.frm_UnidadMedida.get('Tipo')?.value
    };

    this.unidadService.actualizar(unidadActualizada).subscribe(() => {
      Swal.fire('Exito', 'La unidad de medida se actualizó con éxito', 'success');
      this.navegacion.navigate(['/unidadmedida']);
    });
  }
}
