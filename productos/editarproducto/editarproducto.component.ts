import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductosService } from '../services/productos.service';
import { Producto } from '../models/producto';

@Component({
  selector: 'app-editarproducto',
  templateUrl: './editarproducto.component.html',
  styleUrls: ['./editarproducto.component.css']
})
export class EditarProductoComponent implements OnInit {
  frm_Producto: FormGroup;
  producto: Producto;
  id: number;

  constructor(
    private fb: FormBuilder,
    private productosService: ProductosService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id']; // get the product ID from URL
    this.productosService.obtenerProducto(this.id).subscribe(data => {
      this.producto = data;
      this.inicializarFormulario();
    });

    this.frm_Producto = this.fb.group({
      Codigo_Barras: ['', Validators.required],
      Nombre_Producto: ['', Validators.required],
      Graba_IVA: ['', Validators.required],
      Unidad_Medida_idUnidad_Medida: ['', Validators.required],
      IVA_idIVA: ['', Validators.required],
      Cantidad: ['', Validators.required],
      Valor_Compra: ['', Validators.required],
      Valor_Venta: ['', Validators.required],
      Proveedores_idProveedores: ['', Validators.required]
    });
  }

  inicializarFormulario() {
    this.frm_Producto.patchValue({
      Codigo_Barras: this.producto.Codigo_Barras,
      Nombre_Producto: this.producto.Nombre_Producto,
      Graba_IVA: this.producto.Graba_IVA,
      Unidad_Medida_idUnidad_Medida: this.producto.Unidad_Medida_idUnidad_Medida,
      IVA_idIVA: this.producto.IVA_idIVA,
      Cantidad: this.producto.Cantidad,
      Valor_Compra: this.producto.Valor_Compra,
      Valor_Venta: this.producto.Valor_Venta,
      Proveedores_idProveedores: this.producto.Proveedores_idProveedores
    });
  }

  actualizarProducto() {
    if (this.frm_Producto.valid) {
      const productoActualizado = this.frm_Producto.value;
      this.productosService.actualizarProducto(this.id, productoActualizado).subscribe({
        next: () => {
          this.router.navigate(['/productos']);
        },
        error: err => {
          console.log(err);
        }
      });
    }
  }
}
