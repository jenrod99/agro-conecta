import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
  Inject,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from 'src/app/material.module';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import {
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {
  MatError,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { provideNativeDateAdapter } from '@angular/material/core';

import { UsersListService } from 'src/app/services/users-list.service';
import { User } from 'src/app/interfaces/UsersInterfaces';
import Swal from 'sweetalert2';
import {
  Product,
  ProductCategory,
} from 'src/app/interfaces/ProductsInterfaces';
import { ProductsServiceService } from 'src/app/services/products-service.service';

// table 1
export interface productsData {
  id: number;
  imagePath: string;
  uname: string;
  budget: number;
  priority: string;
}

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    MatCardModule,
    MaterialModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product.component.html',
})
export class AppProductComponent implements OnInit {
  displayedProductColumns: string[] = [
    'id',
    'product_name',
    'category_id',
    'category_name',
    'actions',
  ];
  productsList: Product[] = [];
  productsCatgories: ProductCategory[] = [];
  myCProduct: Product | null;
  readonly dialog = inject(MatDialog);

  constructor(
    private productService: ProductsServiceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.productService.getProductsList().subscribe((productsList) => {
      this.productsList = productsList;
      console.log(this.productsList);
      this.cdr.detectChanges();
    });
    this.getProductsCategories();
  }

  openDialog() {
    this.dialog.open(CreateProductDialog, {
      width: '600px',
    });
  }

  updateProduct(user: User) {
    console.log(user);

    this.dialog.open(EditProductDialog, {
      width: '600px',
      data: user,
    });
  }

  deleteProduct(userId: number) {
    console.log(userId);
    Swal.fire({
      title: '¿Estás seguro de eliminar este usuario?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(userId).subscribe({
          next: (rta) => {
            Swal.fire({
              title: '¡Hecho!',
              text: 'El usuario ha sido eliminado.',
              icon: 'success',
            }).then(() => {
              this.reloadUsersList();
            });
          },
          error: (error) => {
            console.error('Error de validación:', error.error.errors);

            Swal.fire({
              title: 'Error',
              text: 'Ocurrió un error al eliminar el usuario.',
              icon: 'error',
            });

            if (error.error.errors) {
              for (const key in error.error.errors) {
                if (error.error.errors.hasOwnProperty(key)) {
                  console.log(
                    `Error en el campo ${key}:`,
                    error.error.errors[key]
                  );
                }
              }
            }
          },
        });
      }
    });
  }

  reloadUsersList() {
    this.productService.getProductsList().subscribe((productsList) => {
      this.productsList = productsList;
      console.log('Lista actualizada de productsList:', this.productsList);
    });
  }

  getProductsCategories() {
    this.productService
      .getProductsCategoriesList()
      .subscribe((productsCatgories) => {
        this.productsCatgories = productsCatgories;
        console.log('ProductCategories', this.productsCatgories);
      });
  }
}

@Component({
  selector: 'create-product',
  templateUrl: 'create-product.html',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatError,
    FormsModule,
    ReactiveFormsModule,
    MatLabel,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
    CommonModule
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateProductDialog implements OnInit {
  hide = true;
  maxDate: Date;
  productsList: Product[] = [];
  productsCatgories: ProductCategory[] = [];
  myCProduct: Product | null;

  constructor(
    private productService: ProductsServiceService,
    public dialogRef: MatDialogRef<CreateProductDialog>
  ) {}

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    this.maxDate = new Date(
      currentYear - 18,
      new Date().getMonth(),
      new Date().getDate()
    );

    this.getProductsCategories();
  }

  profileForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    documentNumber: new FormControl('', [Validators.required]),
    userEmail: new FormControl('', [Validators.required, Validators.email]),
    birthDate: new FormControl('', [Validators.required]),
    userName: new FormControl('', [Validators.required]),
    tempPwd: new FormControl('', [Validators.required]),
  });

  submitUserCreation() {
    if (this.profileForm.valid) {
      let newUser: User = {
        user_id: 0,
        names: this.profileForm.controls['firstName'].value ?? '',
        last_names: this.profileForm.controls['lastName'].value ?? '',
        email: this.profileForm.controls['userEmail'].value ?? '',
        document_number:
          this.profileForm.controls['documentNumber'].value ?? '',
        username: this.profileForm.controls['userName'].value ?? '',
        password: this.profileForm.controls['tempPwd'].value ?? '',
        born_date: this.profileForm.controls['birthDate'].value ?? '',
        userType_id: 1,
        userTypes: {
          userType_id: 0,
          userType_name: 'string',
          isDeleted: false,
        },
        document_id: 1,
        documents: {
          document_id: 0,
          document_name: 'string',
          isDeleted: false,
        },
        date: new Date().toISOString(),
        modified: new Date().toISOString(),
        modifiedBy: 'front',
        isDeleted: false,
      };
      console.log(this.profileForm.value);
      // this.userService.setUser(newUser).subscribe({
      //   next: (response) => {
      //     Swal.fire({
      //       title: '¡Usuario Creado!',
      //       text: 'La información del usuario ha sido guardada correctamente.',
      //       icon: 'success',
      //     }).then(() => {
      //       this.dialogRef.close(true);
      //       window.location.reload()
      //     });
      //   },
      //   error: (error) => {
      //     console.error('Error de validación:', error.error.errors);
      //     Swal.fire({
      //       title: 'Error',
      //       text: 'Ocurrió un error al actualizar el usuario.',
      //       icon: 'error',
      //     });
      //   },
      // });
    } else {
      console.error('Formulario no es válido');
    }
  }

  getProductsCategories() {
    this.productService
      .getProductsCategoriesList()
      .subscribe((productsCatgories) => {
        this.productsCatgories = productsCatgories;
        console.log('ProductCategories', this.productsCatgories);
      });
  }
}

@Component({
  selector: 'edit-product',
  templateUrl: 'edit-product.html',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatError,
    FormsModule,
    ReactiveFormsModule,
    MatLabel,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditProductDialog implements OnInit {
  hide = true;
  maxDate: Date;
  userId: number = 0;
  productsList: Product[] = [];
  productsCatgories: ProductCategory[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditProductDialog>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private productService: ProductsServiceService
  ) {}

  profileForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    documentNumber: new FormControl('', [Validators.required]),
    userEmail: new FormControl('', [Validators.required, Validators.email]),
    birthDate: new FormControl('', [Validators.required]),
    userName: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    this.maxDate = new Date(
      currentYear - 18,
      new Date().getMonth(),
      new Date().getDate()
    );
    this.profileForm.patchValue({
      firstName: this.data.names,
      lastName: this.data.last_names,
      documentNumber: this.data.document_number,
      birthDate: new Date(this.data.born_date).toISOString(), // Convertir la fecha si es necesario
      userEmail: this.data.email,
      userName: this.data.username,
    });
  }

  submitUserUpdate() {
    if (this.profileForm.valid) {
      this.userId = this.data.user_id;
      // let newUser: User = {
      //   user_id: this.data.user_id,
      //   names: this.profileForm.controls['firstName'].value ?? '',
      //   last_names: this.profileForm.controls['lastName'].value ?? '',
      //   email: this.profileForm.controls['userEmail'].value ?? '',
      //   document_number:
      //     this.profileForm.controls['documentNumber'].value ?? '',
      //   username: this.profileForm.controls['userName'].value ?? '',
      //   born_date: this.profileForm.controls['birthDate'].value ?? '',
      //   password: this.data.password,
      //   userType_id: 1,
      //   userTypes: {
      //     userType_id: 0,
      //     userType_name: 'string',
      //     isDeleted: false,
      //   },
      //   document_id: 1,
      //   documents: {
      //     document_id: 0,
      //     document_name: 'string',
      //     isDeleted: false,
      //   },
      //   date: new Date().toISOString(),
      //   modified: new Date().toISOString(),
      //   modifiedBy: 'front',
      //   isDeleted: false,
      // };
      // this.productService.updateProduct(newUser, this.data.user_id).subscribe({
      //   next: (response) => {
      //     Swal.fire({
      //       title: '¡Usuario actualizado!',
      //       text: 'La información del usuario ha sido actualizada correctamente.',
      //       icon: 'success',
      //     }).then(() => {
      //       this.dialogRef.close(true);
      //       window.location.reload();
      //     });
      //   },
      //   error: (error) => {
      //     console.error('Error de validación:', error.error.errors);
      //     Swal.fire({
      //       title: 'Error',
      //       text: 'Ocurrió un error al actualizar el usuario.',
      //       icon: 'error',
      //     });
      //   },
      // });
    } else {
      console.error('Formulario no es válido');
    }
  }

  getProductsCategories() {
    this.productService
      .getProductsCategoriesList()
      .subscribe((productsCatgories) => {
        this.productsCatgories = productsCatgories;
        console.log('ProductCategories', this.productsCatgories);
      });
  }
}
