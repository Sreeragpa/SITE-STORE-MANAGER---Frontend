import { Component, inject } from '@angular/core';
import { ItemFormComponent } from '../../shared/components/item-form/item-form.component';
import { itemForm } from '../../shared/enums/formTypes';
import { ProductService } from '../../shared/services/product.service';
import { IProduct } from '../../models/productModel';
import { Router } from '@angular/router';
import { ProductTableComponent } from "../../shared/components/product-table/product-table.component";
import { SocketioService } from '../../shared/services/socketio.service';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [ItemFormComponent, ProductTableComponent],
  templateUrl: './manager-dashboard.component.html',
  styleUrl: './manager-dashboard.component.css',
})
export class ManagerDashboardComponent {
  private productService = inject(ProductService);
  products: IProduct[] = []
  private router = inject(Router);
  private socketio = inject(SocketioService)
 
  itemFormType = itemForm

  items: any;

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next:(res)=>{
        this.products = res.data
      }
    })

    this.socketio.on("connection").subscribe({
      next:(res)=>{
        console.log("connected");
        console.log(res);
      }
    })

    this.socketio.on<IProduct>("product-added").subscribe({
      next:(res)=>{
        this.pushNewProduct(res)
      }
    })

    this.socketio.on<IProduct>("product-deleted").subscribe({
      next:(res)=>{
        this.deleteProduct(res)
      }
    })
  }

  pushNewProduct(data: IProduct){
    this.products.push(data)
  }

  deleteProduct(res: IProduct){
    this.products = this.products.filter((product)=>{
      return String(product._id)!=String(res._id)
    })
  }

  logout(){
    localStorage.removeItem("managerToken");
    this.router.navigate(['manager/login'])
  }

  editUser(_t21: any) {
    throw new Error('Method not implemented.');
  }
}
