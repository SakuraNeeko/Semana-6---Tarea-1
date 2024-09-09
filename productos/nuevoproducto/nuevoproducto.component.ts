import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Iproveedor } from 'src/app/Interfaces/iproveedor';
import { IUnidadMedida } from 'src/app/Interfaces/iunidadmedida';
import { ProveedorService } from 'src/app/Services/proveedores.service';
import { UnidadmedidaService } from 'src/app/Services/unidadmedida.service';
import { ProductoService } from 'src/app/Services/producto.service'; // Agregar servicio de productos
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-nuevoproducto',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './nuevoproducto.component.html',
  styleUrl: './nuevoproducto.component.scss'
})
export class NuevoproductoComponent implements OnInit {
  listaUnidadMedida: IUnidadMedida[] = [];
  listaProveedores: Iproveedor[] = [];
  titulo = 'Nuevo Producto';
  frm_Producto: FormGroup;
  idProducto: number | null = null; // Para controlar si es inserción o actualización

  constructor(
    private unidadServicio: UnidadmedidaService,
    private fb: FormBuilder,
    private proveedorServicio: ProveedorService,
    private productoServicio: ProductoService, // Inyectar servicio de productos
    private route: ActivatedRoute, // Para obtener el ID del producto
    private router: Router // Para redireccionar después de la grabación
  ) {}

  ngOnInit(): void {
    this.unidadServicio.todos().subscribe((data) => (this.listaUnidadMedida = data));
    this.proveedorServicio.todos().subscribe((data) => (this.listaProveedores = data));

    this.crearFormulario();

    // Verificar si hay un ID en la URL (para actualización)
    this.idProducto = this.route.snapshot.paramMap.get('id') ? +this.route.snapshot.paramMap.get('id') : null;
    if (this.idProducto) {
      this.cargarProducto(this.idProducto);
      this.titulo = 'Editar Producto'; // Cambiar el título en modo de edición
    }
  }

  crearFormulario() {
    this.frm_Producto = new FormGroup({
      Codigo_Barras: new FormControl('', Validators.required),
      Nombre_Producto: new FormControl('', Validators.required),
      Graba_IVA: new FormControl('', Validators.required),
      Unidad_Medida_idUnidad_Medida: new FormControl('', Validators.required),
      IVA_idIVA: new FormControl('', Validators.required),
      Cantidad: new FormControl('', [Validators.required, Validators.min(1)]),
      Valor_Compra: new FormControl('', [Validators.required, Validators.min(0)]),
      Valor_Venta: new FormControl('', [Validators.required, Validators.min(0)]),
      Proveedores_idProveedores: new FormControl('', Validators.required)
    });
  }

  cargarProducto(id: number) {
    this.productoServicio.obtenerPorId(id).subscribe((producto) => {
      this.frm_Producto.patchValue(producto); // Llenar el formulario con los datos del producto
    });
  }

  grabar() {
    if (this.frm_Producto.invalid) {
      return;
    }

    const producto = this.frm_Producto.value;

    if (this.idProducto) {
      // Actualizar producto existente
      this.productoServicio.actualizar(this.idProducto, producto).subscribe(() => {
        alert('Producto actualizado con éxito');
        this.router.navigate(['/productos']); // Redirigir a la lista de productos
      });
    } else {
      // Insertar nuevo producto
      this.productoServicio.insertar(producto).subscribe(() => {
        alert('Producto creado con éxito');
        this.router.navigate(['/productos']); // Redirigir a la lista de productos
      });
    }
  }
}
