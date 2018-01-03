import { StreetViewControlOptions } from '@agm/core/services/google-maps-types';
import { ServerDataSource } from 'ng2-smart-table';
import { typeSourceSpan } from '@angular/compiler';
import { ActivatedRoute } from '@angular/router';
import { NbSpinnerService, NbThemeService } from '@nebular/theme';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EmployeeStructureService } from './employee-structure.service';
import { TreeNode, TreeModel, TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions } from 'angular-tree-component';

declare var swal: any;

const actionMapping: IActionMapping = {
  mouse: {
    contextMenu: (tree, node, $event) => {
      $event.preventDefault();
      alert(`context menu for ${node.data.name}`);
    },
    dblClick: (tree, node, $event) => {
      if (node.hasChildren) TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
    },
    drop: (tree, node, $event, {from, to}: {
        from: any;
        to: any;
    }) => {
      console.log(from);
      if(from.parent.data.userID == to.parent.data.userID) return;
      swal({
        title: 'Confirmation',
        text: "Are you sure to change " + from.data.name + '\'s Superior to ' + node.data.name + ' ?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result) {
          TREE_ACTIONS.MOVE_NODE(tree, node, $event, {
            from,
            to,
        });
        }
      });
    },
  },
  keys: {
    [KEYS.ENTER]: (tree, node, $event) => alert(`This is ${node.data.name}`)
  }
};
@Component({
  selector: 'ngx-employee-structure',
  templateUrl: './employee-structure.html',
  styleUrls: ['./employee-structure.component.scss'],
  providers: [EmployeeStructureService],
})
export class EmployeeStructureComponent {
    @Input('userID') userID: number;
    nodes: any[];
    constructor(private employeeStructureService: EmployeeStructureService, private route: ActivatedRoute
    ,private _spinner: NbSpinnerService) {

    }
    ngOnInit() {
      this.nodes = [
        {
          expanded: true,
          name: 'root expanded',
          // subTitle: 'the root',
          children: [
            {
              name: 'child1',
              // subTitle: 'a good child',
              hasChildren: false
            }, {
              name: 'child2',
              // subTitle: 'a bad child',
              hasChildren: false
            },
          ],
        }];
    }

  getChildren(node: any) {
    const payload = {
      userID: node.data.userID,
      isActiveOnly: this.isActiveOnly,
      gmtDiff: parseFloat(localStorage.getItem('gmtDiff')),
    };
    return this.employeeStructureService.loadSubs(payload).toPromise().then( (data) => {

      let nodeChild = [];
      data.employees.forEach(element => {
          nodeChild.push({
              name: element.userName,
              // subTitle: '(' + element.activeStatus + ')' + element.subsCount,
              isExpanded: false,
              isActive: element.activeStatus == 'Active' ? true : false,
              //subsCount: element.subsCount,
              hasChildren: element.subsCount > 0 ? true : false,
              userID: element.userID,
            });
        });
        return nodeChild;
        //  return new Promise((resolve, reject) => {
        //   setTimeout(() => resolve(nodeChild.map((c) => {
        //       return Object.assign({}, c);
        //     })), 1000);
        //   });
    });
  }


  childrenCount(node: TreeNode): string {
    return node && node.children ? `(${node.children.length})` : '';
  }

  filterNodes(text, tree) {
    tree.treeModel.expandAll();
    tree.treeModel.update();
    tree.treeModel.filterNodes(text);
  }
  protected changedNodes: number = 0;
  onMoveNode(event) {
        const payload = {
          superiorID : event.to.parent.userID,
          userID: event.node.userID,
        };
        this.employeeStructureService.changeSuperior(payload).subscribe((data) => {
          
        });
  }
  customTemplateStringOptions: ITreeOptions = {
    // displayField: 'subTitle',
    isExpandedField: 'expanded',
    idField: 'userID',
    getChildren: this.getChildren.bind(this),
    actionMapping,
    nodeHeight: 23,
    allowDrag: (node) => {
      return true;
    },
    allowDrop: (node) => {
      return true;
    },
    useVirtualScroll: true,
    animateExpand: true,
    animateSpeed: 3,
    animateAcceleration: 1.2,
  }
  protected isActiveOnly: boolean = false;
  protected tree: any;
  toogleIsActive(event){
    this.isActiveOnly = !this.isActiveOnly;
    this.onInitialized(this.tree);
  }

  onInitialized(tree) {
    this.tree = tree;
    const payload = {
      userID: localStorage.getItem('userID'),
      isActiveOnly: this.isActiveOnly,
      gmtDiff: parseFloat(localStorage.getItem('gmtDiff')),
    };
    this._spinner.registerLoader(
    this.employeeStructureService.loadFirst(payload).toPromise().then((data) => {
      let node = [];
      data.employees.forEach(element => {
          node.push({
              name: element.userName,
              isActive: element.activeStatus == 'Active' ? true : false,
              // subTitle: '(' + element.activeStatus + ')' + element.subsCount,
              isExpanded: true,
              //subsCount: element.subsCount,
              hasChildren: element.subsCount > 0 ? true : false,
              userID: element.userID,
            });
        });
        this.nodes = node;
         tree.treeModel.update();
         //this.getChildren(this.nodes[0]);
         //console.log(this.nodes);
      })
      );
      this._spinner.load();
  }

  go($event) {
    $event.stopPropagation();
    alert('this method is on the app component');
  }

  activeNodes(treeModel) {
    console.log(treeModel.activeNodes);
  }

}
