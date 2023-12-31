# 链表

链表是线性数据结构（数据元素之间存在着“一对一”关系），链表中的每个元素是一个包含数据 data 和引用字段的对象，引用字段只有 next 为单向链表，同时有 prev 和 next 为双向链表。

## 链表基本操作

**链表读取第 i 个节点或查找指定值的节点**，均需要从头遍历，时间复杂度为 O(n)。

**在不考虑查找节点的过程的情况下，更新（替换 data），插入（新节点 next 指针指向插入位置节点，前一节点的 next 指针指向新节点）、删除（前一节点 next 指针指向下一节点，当前节点置空）**，时间复杂度均为 O(1)。

## 设计链表

设计单向链表的实现。单链表中的节点应该具有两个属性：val 和 next。val 是当前节点的值，next 是指向下一个节点的指针/引用。假设链表中的所有节点都是 0 ~ size - 1 的。

::: code-group

<<< ../../../src/链表/设计链表/linkList.ts#docs[linkList.ts]

<<< ../../../src/链表/设计链表/linkNode.ts#docs[linkNode.ts]

:::

## 算法题

### 1. 从尾到头打印链表

**题目描述**：输入一个链表的头节点，从尾到头反过来返回每个节点的值（用数组返回）。

**分析**：

**遍历 + 反转**，从尾到头将链表节点值打印成数组 array，比如 1 -> 2 -> 3 -> 4 -> 5 -> null 打印为 [5, 4, 3, 2, 1]，遍历节点并将节点值依次放入数组中，直到遍历完成，最后反转数组即可。也可以利用栈后进先出的特点，将节点从头到尾一次入栈，然后再依次出栈即可。

**求解**：

::: code-group

<<< ../../../src/链表/从尾到头打印链表/reversePrint.ts#docs[reversePrint.ts]

<<< ../../../src/链表/设计链表/linkNode.ts#docs[linkNode.ts]

:::

### 2. 链表倒数第 k 个节点

**题目描述**：输入一个链表，输出该链表中倒数第 k 个节点。为了符合大多数人的习惯，本题从 1 开始计数，即链表的尾节点是倒数第 1 个节点。
例如，一个链表有 6 个节点，从头节点开始，它们的值依次是 1、2、3、4、5、6。这个链表的倒数第 3 个节点是值为 4 的节点。

**分析**：

**两次循环法**，倒数第 k 个节点，即顺数第 length - k + 1 个节点，由于是单链表，没有链表长度信息，因此第一步遍历链表，计算出链表长度。第二步，遍历链表到第 length - k + 1 个节点（index = length - k），需要遍历 n + n - k + 1 步。

**快慢指针法**，快指针先走 k 步，然后快慢指针以相同的速度移动，直到快指针到 null，只需要遍历 n 步（因为快指针走了 n 步）。

**求解**：

::: code-group

<<< ../../../src/链表/链表中倒数第k个节点/getKthFromEnd.ts#docs[getKthFromEnd.ts]

<<< ../../../src/链表/设计链表/linkNode.ts#docs[linkNode.ts]

:::

### 3. 反转链表

**题目描述**： 定义一个函数，输入一个链表的头节点，反转该链表并输出反转后链表的头节点。

**分析**：

**原地反转**，定义前驱节点，当前节点，遍历链表，然后缓存后驱节点，将当前节点链接到前驱节 3 点，然后先更新前驱节点为当前节点，再更新当前节点为后驱节点，直到遍历结束返回前驱节点即可。

**递归**，假设链表的其余部分已经被反转，现在是要反转前面的部分，则需要将当前节点的下一节点的next指针指向当前节点，然后将当前节点的next 置为null;

**求解**：

::: code-group

<<< ../../../src/链表/反转链表/reverseList.ts#docs[reverseList.ts]

<<< ../../../src/链表/设计链表/linkNode.ts#docs[linkNode.ts]

:::

### 4. 合并两个排序链表

**题目描述**：输入两个递增排序的链表，合并这两个链表并使新链表中的节点仍然是递增排序的。

**分析**：

**递归法**，对比节点值的大小，小的作为头节点，下一个节点是除去小的节点的链表和另一链表的合并，边界条件是其中一个链表为空，则直接返回另一个链表即可。

**迭代法**，首先，若其中一个链表为空，则直接返回另一个链表即可，否则初始化一个虚假的头结点，当前节点初始化为虚假节点，不断对比节点值大小，将小节点连接在新链表后面，然后更新新链表的尾节点。直到其中一个链表遍历结束，将另一个链表直接链接在末尾。

**求解**：

::: code-group

<<< ../../../src/链表/合并两个排序的链表/mergeTwoLists.ts#docs[mergeTwoLists.ts]

<<< ../../../src/链表/设计链表/linkNode.ts#docs[linkNode.ts]

:::

### 5. 复杂链表的复制

**题目描述**：<font color='red'>输入一个复杂链表（每个节点中有节点值，以及两个指针，一个指向下一个节点，另一个特殊指针 random 指向一个随机节点），</font>请对此链表进行深拷贝，并返回拷贝后的头结点。（注意，输出结果中请不要返回参数中的节点引用，否则判题程序会直接返回空）。

**分析**：

**三次遍历+拆分**，首先对复杂链表进行遍历，在每个节点后面复制一个与当前节点相同的节点（先不理会 random 指针），即 1 -> 2 -> 3 -> 4 -> 5 -> null 变成 1 -> 1 -> 2 -> 2 -> 3 -> 3 -> 4 -> 4 -> 5 -> 5 -> null；然后是再遍历一次原链表（即遍历步长为 2），将 random 指针进行复制；最后再遍历一次，将原链表的节点指向原来的下一个节点，复制链表的节点指向下一个复制的节点，分离成原链表和复制链表，注意判断最后一个复制节点是否为 null。

**两次遍历+哈希**，可以在初次遍历的时候用哈希保存原节点到复制节点（只复制值）的映射，二次遍历时更新复制节点的 next 和 random 指针为与原节点 next 和 random 指针对应的复制节点即可。

**求解**：

::: code-group

<<< ../../../src/链表/复杂链表的复制/copyRandomList.ts#docs[copyRandomList.ts]

<<< ../../../src/链表/设计链表/randomLinkNode.ts#docs[randomLinkNode.ts]

:::

### 6. 删除链表中的重复节点

**题目描述**：在一个排序的链表中，存在重复的结点，请删除该链表中重复的结点，分为重复结点保留（链表 1->2->3->3->4->4->5 处理后为 1->2->3->4->5）和重复的结点不保留（链表 1->2->3->3->4->4->5 处理后为 1->2->5）两种情况，返回链表头指针。

**分析**：

**对于重复节点保留的情况**，从头节点开始遍历，判断当前节点下一个节点是否等于当前节点，如果相等，则当前节点的下一节点为下下节点，直到不等于或者当前节点下一节点为空。

**对于重复节点不保留的情况**，考虑到头节点可能重复，在链表前添加一个虚节点，从该节点开始遍历，当 next 节点和 next.next 节点不为空时，若 next 节点和 next.next 节点的值相等，记录该值，不断将当前节点的 next 指向为 next.next节点，直到 next 节点值不等于该值或 next 为空。

**求解**：

::: code-group

<<< ../../../src/链表/删除链表中重复的结点/deleteDuplication.ts#docs[copyRandomList.ts]

<<< ../../../src/链表/设计链表/linkNode.ts#docs[linkNode.ts]

:::

### 7. 两个链表的第一个公共节点

**题目描述**：输入两个链表，找出它们的第一个公共结点。

**分析**：

**遍历法**，两个链表的公共节点是指从公共节点开始的所有节点是两个链表的共有部分（节点的存储地址相同，因此判断节点对象是否相等）。既然公共节点及其之后的节点完全相同，即不同的是公共节点之前的部分，也就可能存在一个长度差 diff，通过遍历两个链表的长度可以求出 diff，让长的链表先遍历 diff 个节点，以此开始的两个链表的长度相同，那么当遍历到相同节点即第一个公共节点。

**求解**：

::: code-group

<<< ../../../src/链表/两个链表的第一个公共节点/findFirstCommonNode.ts#docs[findFirstCommonNode.ts]

<<< ../../../src/链表/设计链表/linkNode.ts#docs[linkNode.ts]

:::

### 8. 链表中环的入口节点

**题目描述**：给定一个链表，返回链表开始入环的第一个节点。 从链表的头节点开始沿着 next 指针进入环的第一个节点为环的入口节点。如果链表无环，则返回 null。为了表示给定链表中的环，我们使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。 如果 pos 是 -1，则在该链表中没有环。注意，pos 仅仅是用于标识环的情况，并不会作为参数传递到函数中。说明：不允许修改给定的链表。

**分析**：

**哈希法**，遍历链表，将节点不存在 map 中，放入 map 中，若已存在说明是环的入口节点，返回该节点，若遍历到链表末尾 null 若还无环，返回 null。

**快慢指针法**，遍历链表，快指针走两步，慢指针每次走一步，快慢指针必定在环内相遇，此时快指针走过 a + n(b + c) + b = a + (n+1)b + nc， 而慢指针走过的路程 a + b (因为一定还没走完环的第一圈)，两者满足 a + (n+1)b + nc = 2(a + b)， 所以 a = c + (n − 1)(b + c)，即链表头结点到环入口节点的距离 = 相遇点到环入口距离 + （n - 1）* 环，只需要让两新指针分别从头结点和相遇节点单步出发，直到相遇即可。

**求解**：

::: code-group

<<< ../../../src/链表/链表中环的入口节点/detectCycle.ts#docs[detectCycle.ts]

<<< ../../../src/链表/设计链表/linkNode.ts#docs[linkNode.ts]

:::
