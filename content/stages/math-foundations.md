<!-- Generated from content/curriculum.json. Edit the JSON and run npm run content:generate. -->

# 01. Mathematical Foundations

**Level:** Foundational  
**Scope:** 5 sections · 73 required topics · 10 optional, depth, or later topics

The mathematical language needed to understand, implement and diagnose learning systems.

## Order

01. Linear Algebra & Proof
02. Calculus & Automatic Differentiation
03. Probability, Information & Bayesian Reasoning
04. Statistics, Experimentation & Causality
05. Optimization & Numerical Methods

## 01. Linear Algebra & Proof

**Why:** Models are compositions of linear maps. Geometry, rank and conditioning explain what a model can represent and when a correct formula still fails numerically.

### Learn this much

- [ ] Definitions, quantifiers, implications and counterexamples _(Required)_
- [ ] Scalars, vectors, matrices and tensor shape notation _(Required)_
- [ ] Linear maps, matrix representations and composition _(Required)_
- [ ] Span, independence, basis and change of coordinates _(Required)_
- [ ] Column space, row space, null space and orthogonal complements _(Required)_
- [ ] Rank, invertibility, solution sets and identifiability _(Required)_
- [ ] Inner products, norms, angles and distance _(Required)_
- [ ] Orthogonality, orthonormal bases and Gram-Schmidt _(Required)_
- [ ] Projection matrices and residual geometry _(Required)_
- [ ] Least squares, normal equations and stable solution routes _(Required)_
- [ ] Eigenvalues, eigenvectors, diagonalization and spectral reasoning _(Required)_
- [ ] Symmetric and positive-semidefinite matrices; Gram matrices _(Required)_
- [ ] Singular-value decomposition and the pseudoinverse _(Required)_
- [ ] PCA, low-rank approximation and reconstruction error _(Required)_
- [ ] Batched shapes, broadcasting, parameter counts and operation costs _(Required)_
- [ ] Condition number, residual error, solution error and numerical stability _(Required)_
- [ ] Sparse and structured matrices _(Later)_
- [ ] Advanced matrix perturbation theory _(Depth)_

### Study units

#### U1. Proof habits and shape notation

**About 6 h** · **Target:** Explain + Derive

Topics: Definitions, quantifiers, implications and counterexamples; Scalars, vectors, matrices and tensor shape notation

A correct calculation can still answer the wrong quantified question. Proof habits make the assumptions behind every later decomposition and solver visible.

**You can now**

- Translate a linear-algebra claim between prose, quantifiers, indexed sums and explicit shapes.
- Prove an implication in both directions when needed, and identify where its assumptions enter.
- Use contradiction, induction or a small counterexample rather than treating numerical tests as proofs.

**Study**

1. [Mathematics for Computer Science: proof templates and notation](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/pages/readings/) (MIT 6.042J - Proof strand) - Lehman, Leighton and Meyer, Chapter 1, sections 1.1 to 1.9 (pp. 5 to 19); Chapter 3, sections 3.1 (pp. 42 to 45) and 3.6 (pp. 56 to 61); sections 4.1 to 4.4 (pp. 81 to 93). Depth: In Chapter 4, read the definitions of sets, sequences, functions and relations. Leave cardinality and the remaining logical-circuit material.
2. [Induction and invariants](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/pages/readings/) (MIT 6.042J - Proof strand) - Chapter 5, sections 5.1 to 5.3 (pp. 115 to 130), then 5.4.1 to 5.4.3 (pp. 130 to 136). Depth: Read the ordinary and strong induction templates and the robot invariant. Stop before the later state-machine applications.
3. [Vectors, matrices and indexed products](https://mml-book.github.io/book/mml-book.pdf) (Mathematics for Machine Learning) - Chapter 2, section 2.2 (pp. 22 to 27), especially the indexed matrix-product definition on p. 22. Depth: Use this as notation repair, not a second first pass. Treat a tensor here as an array with an ordered list of axis sizes; multilinear tensor theory is outside this unit.

**Focus**

- Declare domains before quantifiers. Negating 'for every $`x`$, $`P(x)`$' gives 'there exists $`x`$ with not $`P(x)`$', not 'every $`x`$ fails'.
- Separate an implication, its converse and its contrapositive. An iff requires both directions.
- For $`A`$ of shape $`(m,n)`$, write $`(Ax)_i=\sum_j A_{ij}x_j`$ with $`x`$ in $`\mathbb{R}^n`$. Distinguish a scalar, a vector, a column matrix and an array with extra axes.
- An induction proof needs a starting case and a step for every permitted index. An invariant needs initialization and preservation.

**Reproduce:** Closed-book, prove that the columns $`a_1,\ldots,a_n`$ of a real $`m`$ by $`n`$ matrix $`A`$ are independent iff $`Ax=0`$ has only $`x=0`$, using $`Ax=\sum_j x_j a_j`$ in both directions. Then prove $`(A^k)^\top=(A^\top)^k`$ for square $`A`$ and all integers $`k\ge 0`$, starting with $`A^0=I`$ and using the transpose-of-product rule in the step. As one NumPy check, create A=np.array([[1,2],[2,4]],dtype=np.float64) and z=np.array([-2,1],dtype=np.float64), with no random draws. Compute np.linalg.norm(A@z,2): the reference run gives 0.0, below 1e-12. The nonzero witness $`z`$ refutes independence for this $`A`$; the numerical check does not prove the general iff.

**Traps**

- Checking several vectors cannot establish a claim about all real vectors. One exact counterexample can refute it.
- Swapping 'for every $`b`$ there exists $`x`$' with 'there exists $`x`$ for every $`b`$' changes solvability into a much stronger claim.
- A vector of mathematical shape $`n`$ is not automatically a NumPy (n,1) column. Write the storage shape separately.

**Practice**

- [6.042J text: Problem 1.3(a), a bogus inequality proof](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/pages/readings/) - Chapter 1, Problem 1.3(a), printed p. 21. Identify the first invalid step and repair the direction of the inequality. Then annotate the two linear-algebra proofs in reproduce with the assumption used at each step.

**Stop when:** You can write the iff and transpose-power proofs without notes, negate the solvability claim with the domains intact, and explain why the NumPy witness is a refutation rather than a universal proof.

<details>
<summary>Self-test</summary>

1. Where do the assumptions enter the independence iff proof?
   - $`A`$ has $`n`$ columns in $`\mathbb{R}^m`$, so $`Ax`$ is the same linear combination used in the definition. Independence forces all coefficients $`x_j`$ to vanish in the forward direction. In the reverse direction, the assumed trivial kernel forces the coefficients of any zero combination to vanish. Neither direction requires $`A`$ to be square.
2. Negate: for every $`b`$ in $`\mathbb{R}^m`$ there exists $`x`$ in $`\mathbb{R}^n`$ with $`Ax=b`$.
   - There exists $`b`$ in $`\mathbb{R}^m`$ such that for every $`x`$ in $`\mathbb{R}^n`$, $`Ax`$ is not $`b`$. This is one unattainable right-hand side, not a statement that every $`b`$ is unattainable.
3. Why does the transpose-power induction start at zero, and what does its step use?
   - For square $`A`$, $`A^0=I`$ and $`I^\top=I`$ establish $`k=0`$. If the claim holds at $`k`$, then $`(A^{k+1})^\top=(A^k A)^\top=A^\top(A^k)^\top=A^\top(A^\top)^k=(A^\top)^{k+1}`$. Squareness makes the powers defined; the induction hypothesis is used at the third equality.
4. Is $`T(x)=x+c`$ linear for a fixed nonzero vector $`c`$?
   - No. Every linear map sends zero to zero, but $`T(0)=c`$. Nonzero $`c`$ is the assumption used to obtain the contradiction.

</details>

#### U2. Linear maps, span, independence and change of basis

**About 4 h** · **Target:** Derive

Topics: Linear maps, matrix representations and composition; Span, independence, basis and change of coordinates

Coordinates describe a vector; they are not the vector itself. Keeping that distinction prevents wrong transposes and explains why a better basis can simplify the same map.

**You can now**

- Construct a matrix representation from the images of an ordered basis and derive the matrix for a composition.
- Distinguish spanning, independence and being a basis, including uniqueness of coordinates.
- Derive the change-of-coordinates formula with separate input and output bases.

**Study**

1. [Independence and matrix representations](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/video_galleries/video-lectures/) (MIT 18.06 - Linear Algebra) - Video Lecture 9, Independence, basis, and dimension; Lecture 30, Linear transformations and their matrices; Lecture 31, Change of basis; image compression. Depth: In Lecture 31, stop after change of basis; leave image compression for SVD. These are video numbers, not calendar session numbers.
2. [Basis change as a composition](https://mml-book.github.io/book/mml-book.pdf) (Mathematics for Machine Learning) - Chapter 2, sections 2.5 to 2.6 (pp. 40 to 48) for definitions, then 2.7.1 to 2.7.2 (pp. 50 to 58), especially Theorem 2.20 and its proof on pp. 54 to 55. Depth: Read the basis-change proof line by line. Leave kernel/image in 2.7.3 for the next unit.

**Focus**

- Spanning gives existence of coordinates; independence gives uniqueness. Both are needed for a basis.
- Column $`j`$ is the output coordinate vector of the image of input basis vector $`j`$. Composition acts right to left on column vectors.
- If $`x_{\text{old}}=Sx_{\text{new}}`$ and $`y_{\text{old}}=Ty_{\text{new}}`$, then the new representation is $`T^{-1}AS`$. Only an endomorphism with the same basis change at both ends gives $`S^{-1}AS`$.

**Reproduce:** Derive $`T^{-1}AS`$ by following coordinates through three maps. By hand take $`A=\operatorname{diag}(2,1)`$, $`S=\left[\begin{smallmatrix}1&1\\0&1\end{smallmatrix}\right]`$, $`T=\left[\begin{smallmatrix}1&0\\1&1\end{smallmatrix}\right]`$ and obtain $`C=\left[\begin{smallmatrix}2&2\\-2&-1\end{smallmatrix}\right]`$. For new input $`z=(1,2)`$, compute old input $`(3,2)`$, old output $`(6,2)`$, and new output $`(6,-4)`$. Check once in NumPy: create these arrays with dtype=np.float64, without random draws; compute C=np.linalg.solve(T,A@S) and np.linalg.norm(T@(C@z)-A@(S@z),2). The reference difference is 0.0; require it below 1e-12 rather than asserting floating-point equality.

**Traps**

- $`S`$ contains the new basis vectors in old coordinates, not the reverse conversion. The inverse belongs on the output conversion.
- A spanning list may contain redundant vectors. Its coefficients need not be unique.
- An affine map with a nonzero offset is not a linear map even when implemented with a matrix multiplication.

**Practice**

- [MML Exercise 2.20: bases on both sides of a linear map](https://mml-book.github.io/book/mml-book.pdf) - Chapter 2, Exercise 2.20(a) to (f), printed pp. 68 to 69. Draw the two bases and solve the coordinate conversions before multiplying matrices. Part (f) checks the same output by two coordinate routes.

**Stop when:** You solve Exercise 2.20 through its two output routes and can derive the order $`T^{-1}AS`$ without memorizing it.

<details>
<summary>Self-test</summary>

1. Why does a basis give unique coordinates?
   - Spanning gives at least one expansion. Subtracting two expansions gives a zero linear combination. Independence forces every difference of coefficients to be zero. The two basis assumptions are used in different steps.
2. For $`f(x)=Ax`$ and $`g(y)=By`$, which matrix represents $`g`$ composed with $`f`$?
   - $`BA`$: $`g(f(x))=B(Ax)`$. If $`A`$ is $`m`$ by $`n`$, $`B`$ must have $`m`$ columns; with $`B`$ of shape $`p`$ by $`m`$ the result is $`p`$ by $`n`$.
3. Why is using $`S^\top`$ instead of $`S^{-1}`$ wrong in general?
   - A basis matrix need only be invertible, not orthogonal. For $`S=\left[\begin{smallmatrix}1&1\\0&1\end{smallmatrix}\right]`$, $`S^\top=\left[\begin{smallmatrix}1&0\\1&1\end{smallmatrix}\right]`$, while $`S^{-1}=\left[\begin{smallmatrix}1&-1\\0&1\end{smallmatrix}\right]`$. Only orthonormal basis columns imply $`S^\top=S^{-1}`$.

</details>

#### U3. The four subspaces, rank and solution sets

**About 5 h** · **Target:** Derive

Topics: Column space, row space, null space and orthogonal complements; Rank, invertibility, solution sets and identifiability

Rank tells you which outputs are reachable and which parameter changes leave outputs unchanged. These are different failure modes, even before fitting data.

**You can now**

- Find bases for all four fundamental subspaces and state their ambient spaces and dimensions.
- Prove rank-nullity and the orthogonal-complement relations for a real matrix.
- Describe every solution of $`Ax=b`$ and distinguish existence from identifiability of $`x`$.

**Study**

1. [Null spaces, solution sets and the four subspaces](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/video_galleries/video-lectures/) (MIT 18.06 - Linear Algebra) - Video Lectures 6 to 8, Column space and nullspace through Solving $`Ax=b`$; Lecture 10, The four fundamental subspaces; Lecture 14, Orthogonal vectors and subspaces. Depth: In Lecture 14, focus on row/null and column/left-null orthogonality. The norm and angle calculations belong to the next unit.
2. [Rank-nullity and orthogonal complements](https://mml-book.github.io/book/mml-book.pdf) (Mathematics for Machine Learning) - Chapter 2, section 2.7.3 (pp. 58 to 60), Theorem 2.24 on p. 60; Chapter 3, section 3.6 (pp. 79 to 80).

**Focus**

- For $`A`$ in $`\mathbb{R}^{m \times n}`$ of rank $`r`$, column and left-null spaces live in $`\mathbb{R}^m`$ with dimensions $`r`$ and $`m-r`$. Row and null spaces live in $`\mathbb{R}^n`$ with dimensions $`r`$ and $`n-r`$.
- Prove rank-nullity by extending a basis of $`\ker(A)`$ to a domain basis; show that the images of the added vectors form a basis of $`\operatorname{im}(A)`$.
- Each row dotted with $`x`$ is a component of $`Ax`$. This gives $`\ker(A)=\operatorname{row}(A)^\perp`$; apply the same argument to $`A^\top`$ for the other pair.
- $`Ax=b`$ is solvable iff $`b`$ lies in $`\operatorname{col}(A)`$. When solvable, its full solution set is $`x_p+\ker(A)`$, so unique coefficients require full column rank.

**Reproduce:** By hand use $`A=\left[\begin{smallmatrix}1&2&0\\0&0&1\\1&2&1\end{smallmatrix}\right]`$. Find column basis $`\{(1,0,1),(0,1,1)\}`$, row basis $`\{(1,2,0),(0,0,1)\}`$, null basis $`\{(-2,1,0)\}`$, and left-null basis $`\{(-1,-1,1)\}`$. For $`b=(3,4,7)`$, obtain all solutions $`(3,0,4)+t(-2,1,0)`$. Changing $`b`$ to $`(3,4,8)`$ makes the system inconsistent. Write the basis-extension proof of rank-nullity. Check once in NumPy with all arrays dtype=np.float64 and no random draws: matrix_rank(A) gives 2; the vector 2-norms of A@(-2,1,0), A.T@(-1,-1,1), and A@(3,0,4)-b each give 0.0, below 1e-12. The left-null vector dotted with $`(3,4,8)`$ gives approximately 1, certifying the hand inconsistency argument.

**Traps**

- Pivot columns must be taken from the original $`A`$ to form a column-space basis. Row reduction preserves the row space and kernel, not the column space as a subset of $`\mathbb{R}^m`$.
- A tall matrix can have a unique solution for each attainable $`b`$ without being surjective. Full column rank and full row rank answer different questions.
- Numerical rank depends on a singular-value threshold. Do not confuse that decision with exact dependence in a symbolic matrix.

**Practice**

- [18.06 Problem set 3: incompatible spaces and solution-set claims](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/pages/assignments/) - Problem set 3, Problem 2 (Strang 4th ed., section 3.2, #24), then Problem 10 (section 3.4, #13). The official solutions reproduce the statements. Attempt both before reading the solutions. Use dimensions for the first problem and compute a 2 by 2 counterexample for the minimum-length claim in the second.

**Stop when:** You derive all four spaces and the full solution family for the worked matrix, prove rank-nullity, and reject the incompatible-space request in Problem set 3 using dimensions rather than trial and error.

<details>
<summary>Self-test</summary>

1. Why are the images of the added basis vectors independent in the rank-nullity proof?
   - A zero combination of their images puts the corresponding domain combination in $`\ker(A)`$. Express it in the chosen kernel basis. Independence of the extended domain basis then forces all added-vector coefficients to be zero. Finite dimension permits the basis extension; linearity moves the combination through $`A`$.
2. When does a real $`m`$ by $`n`$ matrix give exactly one solution for every $`b`$ in $`\mathbb{R}^m`$?
   - Existence for every $`b`$ requires rank $`m`$; uniqueness requires rank $`n`$. Both imply $`m=n=\operatorname{rank}(A)`$, so $`A`$ is square and invertible.
3. Why is the full solution set $`x_p+\ker(A)`$, not $`\operatorname{span}\{x_p,\ker(A)\}`$?
   - Linearity gives $`A(x_p+z)=b`$ when $`Az=0`$. Conversely, any solution $`x`$ satisfies $`A(x-x_p)=0`$. The coefficient of $`x_p`$ is fixed at one unless $`b=0`$; scaling $`x_p`$ generally scales $`b`$.
4. How can a left-null vector disprove solvability?
   - If $`A^\top l=0`$, then $`l^\top Ax=0`$ for every $`x`$. Thus $`l^\top b`$ must vanish for a solution to exist. For the worked matrix $`l=(-1,-1,1)`$ and $`b=(3,4,8)`$, it is 1, a contradiction.

</details>

#### U4. Inner products, norms, orthogonality and Gram-Schmidt

**About 4 h** · **Target:** Derive + Implement

Topics: Inner products, norms, angles and distance; Orthogonality, orthonormal bases and Gram-Schmidt

Orthonormal coordinates separate directions without mixing their lengths. They are the geometric foundation of projections, QR and spectral decompositions.

**You can now**

- Derive Cauchy-Schwarz and the induced norm, distance and angle from a real inner product.
- Prove that orthonormal coordinates preserve inner products and lengths.
- Implement Gram-Schmidt and check orthogonality, reconstruction and a dependent-column failure.

**Study**

1. [Orthogonal vectors and Gram-Schmidt](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/video_galleries/video-lectures/) (MIT 18.06 - Linear Algebra) - Video Lecture 14, Orthogonal vectors and subspaces; Lecture 17, Orthogonal matrices and Gram-Schmidt.
2. [Inner-product geometry and its inequalities](https://mml-book.github.io/book/mml-book.pdf) (Mathematics for Machine Learning) - Chapter 3, sections 3.1 to 3.5 (pp. 71 to 79), especially Cauchy-Schwarz, equation (3.17); section 3.8.3, Gram-Schmidt Orthogonalization (pp. 89 to 90). Depth: Use these definitions and the Gram-Schmidt construction to check the lectures. Leave function inner products and rotations.

**Focus**

- A real inner product is bilinear, symmetric and positive definite. Its induced norm is $`\sqrt{<x,x>}`$; angles require both vectors to be nonzero.
- For $`y`$ nonzero, expand the nonnegative squared norm of $`x-(<x,y>/<y,y>)y`$ to derive Cauchy-Schwarz. Handle $`y=0`$ separately.
- Gram-Schmidt subtracts components in previously accepted directions and then normalizes. Independence is what prevents a zero residual in exact arithmetic.
- For tall $`Q`$ with $`Q^\top Q=I`$, lengths are preserved in the coordinate-to-vector map. $`QQ^\top`$ need not be the identity.

**Reproduce:** Derive Cauchy-Schwarz from the nonnegative squared norm, then work MML Exercise 3.8 by hand: $`b_1=(1,1,1)`$, $`b_2=(-1,2,0)`$ give $`q_1=(1,1,1)/\sqrt{3}`$, $`q_2=(-4,5,-1)/\sqrt{42}`$. Implement modified Gram-Schmidt for A=np.array([[1,-1],[1,2],[1,0]],dtype=np.float64), with no random draws: for each column v, sequentially set R[i,j]=Q[:,i]@v and v-=R[i,j]*Q[:,i], then R[j,j]=norm(v,2) and Q[:,j]=v/R[j,j]. Reject a residual norm $`\le 10^{-12}`$ on this small scale. Check the Frobenius norms of Q.T@Q-I and A-Q@R; the reference run gives 3.6e-16 and 2.2e-16. Against Qref=np.linalg.qr(A,mode='reduced')[0], the projector difference norm(Q@Q.T-Qref@Qref.T,'fro') is 5.1e-16. Require all three below 1e-12. Replacing $`b_2`$ by $`2b_1`$ must trigger the dependence guard.

**Traps**

- Orthogonal vectors are not necessarily unit vectors. Projection coefficients need division by their squared lengths unless they are normalized.
- Normalizing a zero or numerically tiny Gram-Schmidt residual produces invalid or unreliable columns. A fixed threshold is only appropriate to the stated scale.
- Comparing $`Q`$ columns directly with a library QR ignores valid sign changes. Compare spans through projectors and check your own reconstruction.

**Practice**

- [18.06 Problem set 6: Gram-Schmidt in $`\mathbb{R}^4`$](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/pages/assignments/) - Problem set 6, Strang 4th ed., section 4.4, Problem 18. Orthogonalize the three difference vectors and prove they span the complement of $`(1,1,1,1)`$. Attempt before opening the official solutions. Run your implementation on these columns as a second case.

**Stop when:** You derive the inequality, reproduce the two-vector orthonormal basis, pass the three norm checks and reject dependent columns before division.

<details>
<summary>Self-test</summary>

1. Where does positive definiteness enter Cauchy-Schwarz?
   - For $`y`$ nonzero it gives $`<y,y>>0`$, permitting division. The squared residual is nonnegative, yielding $`<x,y>^2\le <x,x><y,y>`$. Equality requires the residual to be zero, again by positive definiteness. For $`y=0`$ both sides are zero.
2. How does Cauchy-Schwarz imply the triangle inequality?
   - Expand $`\|x+y\|^2=\|x\|^2+2<x,y>+\|y\|^2`$ and bound $`<x,y>\le\|x\|\|y\|`$. This is at most $`(\|x\|+\|y\|)^2`$. Both sides are nonnegative, so taking square roots preserves the inequality.
3. Why does Gram-Schmidt keep the same span at every step?
   - The new residual is the current input minus a combination of earlier outputs, so it lies in the enlarged input span. Conversely the input is that residual plus earlier outputs. Independence makes the residual nonzero, so normalization changes neither span. The first nonzero input establishes the base case.
4. For $`Q`$ of shape 3 by 2 with orthonormal columns, why is $`QQ^\top`$ not $`I_3`$?
   - Its image has dimension two and it annihilates the one-dimensional orthogonal complement. $`I_3`$ has rank three. $`Q^\top Q=I_2`$ still implies $`\|Qz\|_2=\|z\|_2`$ for $`z`$ in $`\mathbb{R}^2`$.

</details>

#### U5. Projections, residuals and least squares

**About 5 h** · **Target:** Derive + Implement

Topics: Projection matrices and residual geometry; Least squares, normal equations and stable solution routes

Least squares is a geometric approximation before it is a statistical estimator. That geometry explains both the normal equations and why a correct formula need not be the right computational method.

**You can now**

- Derive the normal equations from residual orthogonality, without differentiating a loss.
- Prove symmetry and idempotence of an orthogonal projection and explain uniqueness of the fitted vector.
- Implement projection and a full-column-rank least-squares solve using QR with shape and residual checks.

**Study**

1. [Projection matrices and least squares](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/video_galleries/video-lectures/) (MIT 18.06 - Linear Algebra) - Video Lecture 15, Projections onto subspaces; Lecture 16, Projection matrices and least squares.
2. [Least squares via QR](https://web.stanford.edu/~boyd/vmls/vmls.pdf) (Introduction to Applied Linear Algebra) - Chapter 12, sections 12.1 to 12.3, printed pp. 225 to 234; Algorithm 12.1 on p. 232. Depth: Read the solution and QR algorithm, not the application examples in 12.4. Implement a triangular solve, not an explicit inverse.
3. [Alternative least-squares solution routes](https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/resources/lecture-9-four-ways-to-solve-least-squares-problems/) (MIT 18.065 - Applied matrix bridge) - Lecture 9, Four Ways to Solve Least Squares Problems. Depth: Compare the algebraic routes. Leave the near-collinear normal-equations-versus-QR experiment to Classical ML.

**Focus**

- Split $`b=p+r`$ with $`p`$ in $`\operatorname{col}(A)`$ and $`r`$ perpendicular to $`\operatorname{col}(A)`$. For any other fitted vector $`p+d`$, Pythagoras gives $`\|b-(p+d)\|_2^2=\|r\|_2^2+\|d\|_2^2`$.
- Residual orthogonality gives $`A^\top(b-Ax)=0`$. Full column rank makes $`A^\top A`$ invertible and the coefficient solution unique.
- $`P=A(A^\top A)^{-1}A^\top`$ is a derivation formula. With an orthonormal column basis $`Q`$, compute $`P=QQ^\top`$ and solve $`Rx=Q^\top b`$.
- $`P^2=P`$ expresses projecting twice; $`P^\top=P`$ expresses orthogonality. Idempotence alone allows oblique projections.

**Reproduce:** Closed-book, derive the Pythagorean minimization argument, normal equations, $`P^\top=P`$ and $`P^2=P`$. For $`A=\left[\begin{smallmatrix}1&0\\1&1\\0&1\end{smallmatrix}\right]`$ and $`b=(1,0,0)`$, work by hand to get $`x=(2/3,-1/3)`$, residual $`(1/3,-1/3,1/3)`$, and $`P=\frac{1}{3}\left[\begin{smallmatrix}2&1&-1\\1&2&1\\-1&1&2\end{smallmatrix}\right]`$. Implement the NumPy check with A and b as float64 arrays, no random draws: Q,R=np.linalg.qr(A,mode='reduced'); x=np.linalg.solve(R,Q.T@b); P=Q@Q.T. Measure norm(P-P_hand,'fro'), norm(P@P-P,'fro'), norm(P.T-P,'fro'), and norm(A.T@(b-A@x),2). The reference values are 5.7e-16, 5.7e-16, 0.0 and 5.5e-16; require each below 1e-12. The squared residual norm is approximately 0.3333333333333334, within 1e-12 of 1/3.

**Traps**

- A small residual is not required at the optimum: an unattainable $`b`$ leaves a nonzero orthogonal residual. Test $`A^\top r`$ as well.
- Rank deficiency leaves the fitted vector unique but may leave infinitely many coefficient vectors. The inverse formula is then undefined.
- For $`P=\left[\begin{smallmatrix}1&1\\0&0\end{smallmatrix}\right]`$, $`P^2=P`$ but $`P^\top`$ is not $`P`$. It is not the nearest-point Euclidean projection.

**Practice**

- [18.06 Problem set 5: complementary projection](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/pages/assignments/) - Problem set 5, Strang 4th ed., section 4.2, Problems 13 and 17. Compute the 4 by 4 projector, then prove that $`I-P`$ is idempotent and identify the residual subspace for an orthogonal $`P`$. Attempt before the official solutions. The section mini-project should also test your QR solver on a new full-rank matrix and a rank-deficient failure.

**Stop when:** You derive the normal equations and both projector identities, implement the QR solve, and explain why uniqueness of $`p`$ is weaker than uniqueness of $`x`$.

<details>
<summary>Self-test</summary>

1. Why is the orthogonal projection the unique nearest fitted vector?
   - Every alternative differs by $`d`$ in the subspace. Orthogonality makes $`r^\top d=0`$, so its squared error is $`\|r\|^2+\|d\|^2`$. Positive definiteness makes the extra term positive unless $`d=0`$. No column-rank assumption is needed for uniqueness of the fitted vector.
2. Where is full column rank used in deriving the inverse formula?
   - For nonzero $`z`$, independence gives $`Az`$ nonzero, so $`z^\top A^\top Az=\|Az\|^2>0`$. Thus $`A^\top A`$ is invertible. Residual orthogonality gives normal equations even without this assumption.
3. Why do symmetry and idempotence together imply an orthogonal projection?
   - Idempotence fixes every vector in $`\operatorname{im}(P)`$ and puts $`(I-P)b`$ in $`\ker(P)`$. For $`Pu`$ in $`\operatorname{im}(P)`$ and $`z`$ in $`\ker(P)`$, symmetry gives $`(Pu)^\top z=u^\top Pz=0`$. Thus the two pieces are orthogonal; neither condition alone supplies both facts.
4. For full-column-rank $`A=QR`$, why solve $`Rx=Q^\top b`$?
   - $`Q^\top(b-QRx)=0`$ follows from residual orthogonality. $`Q^\top Q=I`$ reduces it to $`Rx=Q^\top b`$. Full column rank makes square triangular $`R`$ invertible. This avoids forming $`A^\top A`$.

</details>

#### U6. Eigenvalues, symmetric and positive-semidefinite matrices

**About 6 h** · **Target:** Derive

Topics: Eigenvalues, eigenvectors, diagonalization and spectral reasoning; Symmetric and positive-semidefinite matrices; Gram matrices

Symmetry turns a matrix into independent orthogonal directions. The signs of its eigenvalues then decide whether its quadratic form is a valid squared length or has a downhill direction.

**You can now**

- Derive a symmetric eigendecomposition and explain why a general square matrix may not diagonalize.
- Give the spectral-theorem induction argument, including the invariant orthogonal complement.
- Prove the eigenvalue test for PSD and the Gram-matrix singularity criterion.

**Study**

1. [Eigenvectors, diagonalization and symmetric matrices](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/video_galleries/video-lectures/) (MIT 18.06 - Linear Algebra) - Video Lectures 21 and 22, Eigenvalues and eigenvectors and Diagonalization and powers of A; Lecture 25, Symmetric matrices and positive definiteness; Lecture 27, Positive definite matrices and minima. Depth: Focus Lecture 25 on real eigenvalues and orthogonal eigenvectors; learn the conjugate-transpose argument even though the worked matrices are real. In Lecture 27, focus on quadratic-form tests, not optimization applications.
2. [Gram matrices and the spectral theorem](https://mml-book.github.io/book/mml-book.pdf) (Mathematics for Machine Learning) - Chapter 4, section 4.2, Theorems 4.14 and 4.15 on p. 111 and Example 4.8 on pp. 111 to 112; section 4.4 (pp. 115 to 119). Depth: Check the Gram proof line by line. For repeated eigenvalues, distinguish an orthonormal eigenbasis that exists from an arbitrary basis returned for the eigenspace. Leave Jordan form.
3. [Positive definite and semidefinite matrices](https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/resources/lecture-5-positive-definite-and-semidefinite-matrices/) (MIT 18.065 - Applied matrix bridge) - Lecture 5, Positive Definite and Semidefinite Matrices.

**Focus**

- A real symmetric matrix has an orthonormal eigenbasis. Distinct eigenvalues imply orthogonality; repeated eigenvalues require choosing an orthonormal basis within the eigenspace.
- Complete the spectral-theorem proof by showing that the complement of one unit eigenvector is invariant under $`A`$, then induct on dimension. State the eigenvalue-existence fact you use.
- For symmetric $`A=Q\Lambda Q^\top`$, $`x^\top Ax=\sum_i \lambda_i (q_i^\top x)^2`$. PSD means every eigenvalue is nonnegative; positive definite means every eigenvalue is positive.
- $`A^\top A`$ is PSD since $`x^\top A^\top Ax=\|Ax\|_2^2`$. It is singular exactly when $`A`$ has a nontrivial kernel.

**Reproduce:** Give the spectral-theorem induction proof using the steps in self-test, then derive the PSD eigenvalue test and the Gram singularity criterion. By hand diagonalize $`S=\left[\begin{smallmatrix}2&1\\1&2\end{smallmatrix}\right]`$: eigenvalues 1 and 3, with unit eigenvectors $`(1,-1)/\sqrt{2}`$ and $`(1,1)/\sqrt{2}`$. Contrast it with $`J=\left[\begin{smallmatrix}1&1\\0&1\end{smallmatrix}\right]`$, which has only a one-dimensional eigenspace. Check S once in NumPy: S=np.array([[2,1],[1,2]],dtype=np.float64); lam,Q=np.linalg.eigh(S), with no random draws. Compute norm(S-(Q*lam)@Q.T,'fro') and norm(Q.T@Q-I,'fro'). The reference values are 6.5e-16 and 3.2e-16; require both below 1e-12, and lam within vector 2-norm 1e-12 of (1,3).

**Traps**

- A positive diagonal does not imply PSD: $`\left[\begin{smallmatrix}1&2\\2&1\end{smallmatrix}\right]`$ has eigenvalue -1 and its quadratic form at $`(1,-1)`$ is -2.
- Invertibility does not imply diagonalizability. The worked $`J`$ is invertible but defective.
- The PSD eigenvalue test assumes symmetry. Do not classify a nonsymmetric matrix using only signs of its eigenvalues, or silently pass it to eigh.

**Practice**

- [18.06 Problem set 8: diagonal entries and the largest eigenvalue](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/pages/assignments/) - Problem set 8, Problem 10 (Strang 4th ed., section 6.4, #30). Prove $`a_{11}\le \lambda_{\max}`$ using orthonormal coordinates. Attempt before the official solution. The section mini-project should add power iteration with a separated dominant magnitude, a tied-magnitude failure and an eigen-residual check.
- [MML Exercise 4.5: invertibility versus diagonalizability](https://mml-book.github.io/book/mml-book.pdf) - Chapter 4, Exercise 4.5, printed p. 137. Classify all four 2 by 2 matrices. Exhibit enough independent eigenvectors, or the missing eigenspace dimension, rather than relying on a software label.

**Stop when:** You give the spectral-theorem proof with its base case and invariant complement, diagonalize $`S`$, and prove or refute PSD claims using a quadratic-form witness or the symmetric spectrum.

<details>
<summary>Self-test</summary>

1. How do you complete the spectral-theorem proof, including its assumptions and base case?
   - For $`n=1`$ the real entry and unit basis suffice. For $`n>1`$, the characteristic polynomial has a complex root by the fundamental theorem of algebra, hence an eigenpair $`Az=\lambda z`$. Real symmetry gives $`A^*=A`$, so $`z^*Az`$ is real and $`z^*z>0`$; therefore $`\lambda`$ is real. A nonzero real or imaginary part of $`z`$ gives a real eigenvector $`v`$, which can be normalized. For $`w`$ perpendicular to $`v`$, $`v^\top Aw=(Av)^\top w=\lambda v^\top w=0`$, using symmetry. Thus $`v`$'s complement is invariant. In an orthonormal basis its restriction is real symmetric of dimension $`n-1`$; the induction hypothesis supplies an orthonormal eigenbasis there. Adjoin $`v`$.
2. Why are eigenvectors for distinct eigenvalues orthogonal?
   - For real symmetric $`A`$, $`(Av)^\top w=v^\top Aw`$, so $`\lambda v^\top w=\mu v^\top w`$. Distinct $`\lambda`$ and $`\mu`$ allow division by $`\lambda-\mu`$, forcing $`v^\top w=0`$. This argument alone does not handle repeated eigenvalues.
3. Why is PSD equivalent to nonnegative eigenvalues for a symmetric matrix?
   - Symmetry supplies the orthonormal spectral decomposition. Nonnegative eigenvalues make every term in the quadratic-form sum nonnegative. Conversely, testing the form on each unit eigenvector gives its eigenvalue, so PSD forces each to be nonnegative.
4. When is $`A^\top A`$ singular?
   - If $`Az=0`$ for nonzero $`z`$, then $`A^\top Az=0`$. Conversely, $`A^\top Az=0`$ implies $`0=z^\top A^\top Az=\|Az\|^2`$, so $`Az=0`$. Real Euclidean positive definiteness is used at the last step. Thus the Gram matrix is singular iff the columns of $`A`$ are dependent.

</details>

#### U7. SVD, pseudoinverse and low-rank approximation

**About 6 h** · **Target:** Derive + Implement

Topics: Singular-value decomposition and the pseudoinverse; PCA, low-rank approximation and reconstruction error

SVD describes every real linear map, including rectangular and rank-deficient ones. It unifies lost directions, minimum-norm solutions and the best low-rank representation.

**You can now**

- Construct an SVD from the symmetric eigendecomposition of $`A^\top A`$, including its zero-singular-value case.
- Derive the pseudoinverse as the minimum-norm least-squares solution map.
- Prove the spectral-norm Eckart-Young bound and derive PCA as maximum projected variance.
- Implement truncated-SVD reconstruction and check its error against the singular-value tail.

**Study**

1. [SVD and the pseudoinverse](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/video_galleries/video-lectures/) (MIT 18.06 - Linear Algebra) - Video Lecture 29, Singular value decomposition; Lecture 33, Left and right inverses; pseudoinverse.
2. [Constructing and truncating the SVD](https://mml-book.github.io/book/mml-book.pdf) (Mathematics for Machine Learning) - Chapter 4, section 4.5 (pp. 119 to 129), especially construction equations (4.71) to (4.79) on pp. 123 to 124; section 4.6, Theorems 4.24 and 4.25 and the proof on pp. 131 to 132. Depth: Follow the construction, not the movie-rating example. Normalize $`Av_i`$ only when $`\sigma_i>0`$; complete the left basis orthonormally for the remaining directions.
3. [Best rank-k approximation](https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/resources/lecture-7-eckart-young-the-closest-rank-k-matrix-to-a/) (MIT 18.065 - Applied matrix bridge) - Lecture 7, Eckart-Young: The Closest Rank k Matrix to A. Depth: Focus on the rank constraint and the norm in the optimality claim. Leave large-data applications.
4. [PCA as a variance maximization problem](https://mml-book.github.io/book/mml-book.pdf) (Mathematics for Machine Learning) - Chapter 10, section 10.2 (pp. 320 to 325), equations (10.9) to (10.25). Depth: Use the spectral decomposition to bound the Rayleigh quotient; no optimization algorithm is needed. The book stores samples as columns. Transpose its convention for the row-sample NumPy check.

**Focus**

- For each positive eigenvalue $`\lambda_i`$ of $`A^\top A`$ set $`\sigma_i=\sqrt{\lambda_i}`$, $`u_i=Av_i/\sigma_i`$. Prove $`u_i^\top u_j=\delta_{ij}`$. Zero eigenvalues mean $`Av_i=0`$, not a vector to normalize.
- For $`A=U_r\Sigma_r V_r^\top`$, $`A^+=V_r\Sigma_r^{-1}U_r^\top`$. The row-space solution is orthogonal to all null-space additions, hence has minimum Euclidean norm.
- For rank at most $`k`$, Eckart-Young gives minimum spectral error $`\sigma_{k+1}`$. The truncated SVD also has squared Frobenius error $`\sum_{i>k}\sigma_i^2`$. State which norm you measure.
- For centered row-sample $`X`$ with $`n>1`$, sample covariance is $`X^\top X/(n-1)`$. A unit direction's variance is its Rayleigh quotient; right singular vectors maximize it, and retained variance is sum of retained $`\sigma_i^2/(n-1)`$.

**Reproduce:** Construct the SVD and pseudoinverse by hand for MML Exercise 4.8's $`A=\left[\begin{smallmatrix}3&2&2\\2&3&-2\end{smallmatrix}\right]`$. Singular values are 5 and 3; its rank-1 truncation is $`\left[\begin{smallmatrix}5/2&5/2&0\\5/2&5/2&0\end{smallmatrix}\right]`$, and $`A^+=\frac{1}{45}\left[\begin{smallmatrix}7&2\\2&7\\10&-10\end{smallmatrix}\right]`$. Give the spectral-norm Eckart-Young proof from self-test. As one NumPy check, use float64 A, no random draws, and U,s,Vt=np.linalg.svd(A,full_matrices=False). Implement A1=(U[:,:1]*s[:1])@Vt[:1] and Ap=(Vt.T/s)@U.T. The reconstruction Frobenius norm is 1.2e-15; spectral and Frobenius truncation errors are approximately 3; norm(A@Ap@A-A,'fro') is 2.9e-15. Require identity residuals below 1e-12 and scalar errors within 1e-12 of 3. In the same check use centered float64 X=[[3,0],[-3,0],[0,1],[0,-1]], take its first right singular vector v, and reconstruct (X@v[:,None])@v[None,:]. Verify sample variances (6,2/3) and squared Frobenius reconstruction error 2 within 1e-12. Explain both results from the spectrum, rather than treating this as a fitted ML evaluation.

**Traps**

- Deriving existence from $`A^\top A`$ does not recommend forming it to compute an SVD. Its conditioning cost is proved in the next unit.
- Repeated singular values allow rotations within a singular subspace, not just sign flips. Compare reconstructed matrices or subspace projectors.
- A numerical pseudoinverse must declare its singular-value cutoff. Inverting tiny retained values amplifies noise; never divide by zero and then mask the result.

**Practice**

- [MML Exercises 4.9, 4.11 and 4.12: a square SVD and two spectral proofs](https://mml-book.github.io/book/mml-book.pdf) - Chapter 4, Exercises 4.9, 4.11 and 4.12, printed p. 138. Derive both singular-vector families of the 2 by 2 matrix by hand and keep $`Av=\sigma u`$ when fixing signs. Prove 4.11 from the SVD construction in this unit and 4.12 from the spectral decomposition of $`A^\top A`$; the Eckart-Young proof uses 4.12. The section mini-project should implement a cutoff-aware pseudoinverse and sign-invariant PCA reconstruction on a new matrix, including a zero singular value.
- [18.06 Problem set 10: the Fibonacci matrix SVD](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/pages/assignments/) - Problem set 10, Strang 4th ed., section 6.7, Problem 4. Attempt before the official solutions. Keep $`Av=\sigma u`$ when matching signs; symmetry does not imply $`U=V`$ when an eigenvalue is negative. Skip the neighbouring section 6.7 Problem 11 solution: it incorrectly sets $`U=I`$ for orthogonal columns. The normalized columns belong in $`U`$, with $`V=I`$ before any reordering.

**Stop when:** You construct the wide SVD, derive its pseudoinverse and optimal rank-1 error, give the dimension-intersection proof, and explain the PCA variance and reconstruction checks from the singular spectrum.

<details>
<summary>Self-test</summary>

1. Why does the SVD construction cover rectangular and rank-deficient matrices?
   - $`A^\top A`$ is real symmetric PSD, so the spectral theorem gives an orthonormal domain basis with nonnegative eigenvalues. For positive values, $`u_i^\top u_j=v_i^\top A^\top Av_j/(\sigma_i\sigma_j)=\delta_{ij}`$. For zero values, $`\|Av_i\|^2=0`$. Complete the $`r`$ output vectors to an orthonormal basis of $`\mathbb{R}^m`$; $`m\ge r`$ permits this. The identities on every domain basis vector then give $`A=U\Sigma V^\top`$.
2. What proves the spectral-norm Eckart-Young lower bound?
   - For $`k<\operatorname{rank}(A)`$, any $`B`$ of rank at most $`k`$ has a kernel of dimension at least $`n-k`$. Its intersection with $`\operatorname{span}(v_1,\ldots,v_{k+1})`$ is nontrivial since the dimension sum exceeds $`n`$. Choose a unit $`z`$ there: $`Bz=0`$ and $`\|Az\|\ge\sigma_{k+1}`$, so $`\|A-B\|_2\ge\sigma_{k+1}`$. Orthogonality in the SVD makes the truncated tail attain this bound. For $`k\ge\operatorname{rank}(A)`$, choosing $`B=A`$ gives zero error.
3. Why does $`A^+b`$ select the minimum-norm least-squares solution?
   - In orthonormal output coordinates, minimize each reachable component by setting $`v_i^\top x=(u_i^\top b)/\sigma_i`$ for positive $`\sigma_i`$. Unreachable output components remain in the residual. The null-space coordinates do not affect the residual, but add their squared norm to $`\|x\|^2`$. Setting them to zero uniquely minimizes the norm.
4. Why must the unit-length constraint and centering appear in the PCA derivation?
   - Centering makes $`X^\top X/(n-1)`$ the sample covariance rather than an uncentered second moment. For unit $`v=Qz`$, $`v^\top Cv=\sum_i\lambda_i z_i^2\le\lambda_{\max}`$ since $`\sum_i z_i^2=1`$. Equality is attained in a leading eigendirection. Without the length constraint, scaling a nonzero-variance direction makes the objective unbounded.

</details>

#### U8. Batched shapes, operation costs and conditioning

**About 6 h** · **Target:** Derive + Measure

Topics: Batched shapes, broadcasting, parameter counts and operation costs; Condition number, residual error, solution error and numerical stability

Shapes determine what is computed and how much work it takes. Conditioning determines how much information small input errors can destroy even when the algorithm is stable.

**You can now**

- Trace batched products, transposes, reductions and broadcasting with explicit axis names.
- Derive parameter, activation and arithmetic counts for dense maps and distinguish factorization from solve costs.
- Prove the fixed-$`A`$ perturbation bound and condition-number squaring from the SVD.
- Measure relative residual and solution error on a controlled failure case without confusing conditioning with algorithmic stability.

**Study**

1. [Broadcast-compatible axes](https://numpy.org/doc/stable/user/basics.broadcasting.html#general-broadcasting-rules) (NumPy broadcasting and matmul shape rules) - General broadcasting rules and Broadcastable arrays. Depth: Stop before the vector-quantization application.
2. [Batched matrix products](https://numpy.org/doc/stable/reference/generated/numpy.matmul.html#numpy.matmul) (NumPy broadcasting and matmul shape rules) - Notes: two-dimensional multiplication, stacked matrices, one-dimensional promotion, and the comparison with dot.
3. [Count products and QR work](https://web.stanford.edu/~boyd/vmls/vmls.pdf) (Introduction to Applied Linear Algebra) - Chapter 10, section 10.1, Complexity of matrix multiplication and Complexity of matrix triple product, printed pp. 182 to 183; Chapter 12, section 12.3, Complexity, p. 232. Depth: Use dense arithmetic counts. Leave specialized sparse products and do not interpret these counts as measured runtimes.
4. [Factor once, solve repeatedly](https://fncbook.com/python/efficiency/#solution-of-linear-systems) (Fundamentals of Numerical Computation: conditioning and operation counts) - Python edition, section 2.5.3, Solution of linear systems: Lemma 2.5.1, equations (2.5.7) to (2.5.8), and Theorem 2.5.1. Depth: Derive the loop sums for triangular solves and LU. Skip the unseeded timing demonstrations and leave general asymptotic-definition proofs to Algorithms.
5. [Condition number and the residual-error gap](https://fncbook.com/python/condition-number/) (Fundamentals of Numerical Computation: conditioning and operation counts) - Python edition, section 2.8, equations (2.8.1) to (2.8.6), Definition 2.8.1, then section 2.8.2, equations (2.8.9) to (2.8.11). Depth: Prove the finite bound for perturbing b with A fixed. Skip the unseeded Hilbert example and the first-order matrix-perturbation formula (2.8.7); a finite bound for simultaneous perturbations is outside this unit.
6. [Norms and solver difficulty](https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/video_galleries/video-lectures/) (MIT 18.065 - Applied matrix bridge) - Lecture 8, Norms of Vectors and Matrices; Lecture 10, Survey of Difficulties with $`Ax=b`$. Depth: Focus on the induced 2-norm, conditioning and loss of accuracy. Leave iterative and large-data solution methods.

**Focus**

- Write the contracted axes separately from broadcast batch axes. For a dense $`d`$-to-$`h`$-to-$`p`$ map, shared parameters with biases total $`dh+h+hp+p`$; retaining input, hidden and output for $`N`$ vectors stores $`N(d+h+p)`$ scalar activations.
- The standard dot-product algorithm costs $`mn(2k-1)`$ operations for an $`m`$ by $`k`$ times $`k`$ by $`n`$ product. Modified Gram-Schmidt QR costs about $`2mn^2`$ for $`m\ge n`$; optimized LU costs about $`(2/3)n^3`$ and each triangular solve about $`n^2`$. These are algorithm-specific counts, not timing claims.
- For invertible square $`A`$, $`\kappa_2(A)=\sigma_{\max}/\sigma_{\min}`$. From $`\Delta x=A^{-1}\Delta b`$ and $`\|b\|\le\|A\|\|x\|`$ derive $`\|\Delta x\|/\|x\|\le\kappa(A)\|\Delta b\|/\|b\|`$ for nonzero $`b`$, using compatible induced norms.
- For full-column-rank rectangular $`A`$, define $`\kappa_2(A)=\sigma_{\max}/\sigma_{\min}`$ over its $`n`$ positive singular values. The SVD gives eigenvalues $`\sigma_i^2`$ for $`A^\top A`$, hence $`\kappa_2(A^\top A)=\kappa_2(A)^2`$. Rank deficiency makes the Gram matrix singular.

**Reproduce:** Closed-book, derive the product count, triangular/LU loop sums, the fixed-$`A`$ perturbation bound, and condition-number squaring from $`A=U\Sigma V^\top`$. For a deterministic NumPy check, use float64 X=np.arange(24,dtype=np.float64).reshape(2,3,4), W=np.arange(20,dtype=np.float64).reshape(4,5), bias=np.arange(5,dtype=np.float64), with no random draws. Predict Y=X@W+bias has shape (2,3,5), Y[1,2,4] approximately 1018, and Y.sum(axis=1,keepdims=True) shape (2,1,5). The standard product count is 2*3*5*(2*4-1)=210 scalar operations, plus 30 bias additions, with 25 shared parameters. Then use A=diag(1,1e-6), b=(1,0), db=(0,1e-8), all float64; x=solve(A,b), xp=solve(A,b+db). Measure $`\kappa_2`$ approximately 1e6, relative solution change norm(xp-x,2)/norm(x,2) approximately 0.01, and original-system relative residual norm(b-A@xp,2)/norm(b,2) approximately 1e-8. These attain the bound by design; use absolute tolerance 1e-12 for the two ratios and entry, and relative tolerance 1e-12 for $`\kappa`$. This changes the right-hand side, not the solver.

**Traps**

- A successful broadcast can be wrong: subtracting a (3,) target from a (3,1) prediction produces (3,3), not three residuals. Assert shapes before arithmetic.
- Array .T reverses all axes. For batched matrix transpose use swapaxes(-1,-2); transpose only the two matrix axes.
- A small residual is backward-error evidence, not a guarantee of accurate $`x`$. Conditioning belongs to the mathematical problem; stability belongs to the algorithm.

**Practice**

- [VMLS Exercise 10.11: trace, shapes and computation cost](https://web.stanford.edu/~boyd/vmls/vmls.pdf) - Chapter 10, Exercise 10.11(a) to (d), printed p. 192. Derive the direct elementwise trace computation and its cost instead of forming the whole Gram product. The book's matrix norm here is Frobenius, not the induced 2-norm. The section mini-project should add batched shape assertions and a table of residual versus solution error as conditioning varies.
- [FNC Exercise 2.8.7: condition number of a product](https://fncbook.com/python/condition-number/#problem-cond-product) - Python edition, section 2.8.3, Exercise 2.8.7(a) and (b). Use submultiplicativity and $`(AB)^{-1}=B^{-1}A^{-1}`$, then construct a strict-inequality example. State the induced norm and nonsingularity assumptions.

**Stop when:** You predict the batched output and reduction shapes, derive the operation counts and both conditioning bounds, and explain how the worked case has a tiny residual but a one-percent solution change.

<details>
<summary>Self-test</summary>

1. What shapes result from (2,1,3,4) @ (1,5,4,6), and from swapping only the last two axes of the result?
   - The matrix product is (2,5,3,6): 4 contracts and batch shapes (2,1) and (1,5) broadcast to (2,5). Swapping the matrix axes gives (2,5,6,3). Reversing every axis with .T would instead give (6,3,5,2).
2. Why does forming $`A^\top A`$ square the 2-norm condition number, and which rank assumption is needed?
   - The SVD gives $`A^\top A=V\operatorname{diag}(\sigma_i^2)V^\top`$. With full column rank all $`n`$ eigenvalues are positive, so their extreme ratio is $`(\sigma_{\max}/\sigma_{\min})^2`$. A wide full-row-rank matrix still has a singular Gram matrix, so the finite full-column-rank formula cannot be used there.
3. Where is invertibility used in the perturbation proof, and why does a residual give the same bound?
   - Invertibility lets $`A\Delta x=\Delta b`$ become $`\Delta x=A^{-1}\Delta b`$. Induced-norm inequalities bound the two products, and $`b`$ nonzero permits relative normalization. If $`r=b-A\hat{x}`$, then $`\hat{x}`$ solves the fixed-$`A`$ system with right-hand side $`b-r`$; substitute $`\Delta b=-r`$. No claim is made about the algorithm producing $`\hat{x}`$.
4. Why is reusing factors cheaper for several right-hand sides?
   - For dense $`n`$ by $`n`$ $`A`$, one LU costs about $`(2/3)n^3`$. Each subsequent right-hand side requires two triangular solves, about $`2n^2`$ operations. Recomputing the factorization for every vector repeats cubic work. Pivot comparisons and data movement are not captured by these arithmetic counts.

</details>

### Mini-project: Least squares and PCA from a blank file, with rank and conditioning failures

**About 10 to 14 hours.** Start the one repository the whole stage builds on, numlab/, with its linear-algebra package: a QR least-squares solver, power iteration, a cutoff-aware pseudoinverse and PCA, each checked against an independent NumPy oracle and each shown failing on a case you construct. The solver and the conditioning table carry into the capstone.

1. Create numlab/ with linalg/, autodiff/, prob/, stats/, optim/ and notes/ directories and one pytest suite. Every test fixes its dtype (float64 unless it says otherwise) and its seed, and states its tolerance and why. Before coding, write notes/linalg.md: the normal equations, why the least-squares projector is symmetric and idempotent, and PCA as both maximum variance and best rank-k approximation.
2. Implement thin QR by modified Gram-Schmidt or Householder reflections and solve least squares by back substitution on $`Rx=Q^\top b`$. On a new full-rank tall matrix, match numpy.linalg.lstsq and check $`A^\top r=0`$, $`P^2=P`$ and $`P^\top=P`$ within stated tolerances. Then make one column a combination of the others: show the tiny diagonal entry of $`R`$ and the exploding solution, detect it with a relative threshold on $`|r_{jj}|`$ that you justify, and either raise an error that names the rank deficiency or fall back to the minimum-norm solution.
3. Add power iteration for a symmetric matrix that reports the Rayleigh quotient and the eigen-residual $`\|Av-\rho v\|`$ at every step. On a matrix with a separated dominant eigenvalue, match numpy.linalg.eigh. Then run $`\operatorname{diag}(2,-2,1)`$ from $`(1,0.5,1)`$: the iterate alternates sign in its second entry, the Rayleigh quotient settles at 1.2, which is not an eigenvalue, and the residual stays at 1.6. Make the stopping rule use the residual, so this case is reported as a failure instead of a converged 1.2.
4. Build a pseudoinverse from numpy.linalg.svd with a cutoff relative to the largest singular value, and test it on a new matrix with an exact zero singular value against numpy.linalg.pinv and the four Penrose conditions. Show what the version without a cutoff returns. Implement PCA on centered data: the explained variances, and a reconstruction error equal to the sum of the discarded squared singular values. Compare components through projectors or reconstructions, never raw vectors, so that a sign flip cannot fail a correct answer.
5. Add shape assertions to every function, including a batched (B, m, n) @ (B, n, k) case, and count the flops of the normal equations against QR. Then write the conditioning table: for a family of matrices with growing condition number, such as Vandermonde matrices of rising degree, solve with a known $`x^*`$ and report $`\kappa`$, relative residual and relative error for QR and for the normal equations. Explain from the residual bound why the residual stays near roundoff while the error grows, and why the normal equations lose about twice as many digits.
6. Write notes/linalg-defense.md: why QR rather than the normal equations, how you chose the rank and pseudoinverse cutoffs, and what each tolerance in the tests protects against.

**Deliverables**

- numlab/linalg/: QR least squares with rank detection, power iteration, the cutoff pseudoinverse and PCA.
- The tests: NumPy oracles, projector and Penrose checks, the rank-deficient and tied-magnitude failures, the sign-invariant PCA comparison and the shape assertions.
- notes/linalg.md with the derivations and notes/linalg-defense.md with the conditioning table and its raw output.

**Checks**

- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Derivations | The normal equations, projector properties and both PCA characterizations are derived in the notes without copying. | Each derivation names the assumption it uses, such as full column rank, at the step that needs it. |
| Least squares | QR least squares matches numpy.linalg.lstsq on a full-rank matrix, and the rank-deficient case is detected rather than returned as a huge solution. | The rank threshold is justified from the scale of $`R`$ and machine epsilon, and the fallback returns the minimum-norm solution checked against the pseudoinverse. |
| Spectral methods | Power iteration matches eigh on the separated case and reports failure on the tied-magnitude case. | The note explains the 1.2 Rayleigh quotient from the two tied components, and the stopping rule uses the eigen-residual. |
| SVD and PCA | The pseudoinverse passes the Penrose conditions on the zero-singular-value matrix, and PCA reconstruction error equals the discarded squared singular values. | Every comparison is sign-invariant, and the no-cutoff failure is shown with its output. |
| Conditioning evidence | The table reports $`\kappa`$, residual and error for both solvers on at least four matrices. | The observed digit loss is compared with the residual bound and with the squared condition number of the normal equations. |

Feeds into: Capstone component 1, least squares and PCA: the QR solver with its rank failure and the PCA with its sign-invariant check. The conditioning table opens the defense note.

### Resource route

- **Primary - Course:** [MIT 18.06 - Linear Algebra](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/) - Follow lectures 1-10, 14-17, 21-22, 25, 27, 29-31 and 33 with matching problems. This is the ordered first pass.
- **Required - Practice:** [MIT 6.042J - Proof strand](https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/pages/readings/) - Study textbook Chapters 1 and 3, §§4.1-4.4 and §§5.1-5.4 with matching Unit 1 problems. Leave the rest of the course.
- **Required - Application:** [MIT 18.065 - Applied matrix bridge](https://ocw.mit.edu/courses/18-065-matrix-methods-in-data-analysis-signal-processing-and-machine-learning-spring-2018/resources/lecture-videos/) - Use lectures 3-10 after 18.06 for SVD, PCA, low-rank approximation, matrix norms and solver difficulty.
- **Reference - Theory:** [Mathematics for Machine Learning](https://mml-book.github.io/) - Use Chapters 2-4 and §10.2 to check notation or re-derive a result. Do not treat it as a second course.
- **Support - Practice:** [Introduction to Applied Linear Algebra](https://web.stanford.edu/~boyd/vmls/) - Sample Chapters 1-13 and the extra exercises for computational practice in fitting, least squares and pseudoinverses.
- **Optional - Intuition:** [Essence of Linear Algebra](https://www.3blue1brown.com/topics/linear-algebra) - Open only when a geometric picture is missing; it does not replace derivation or problem solving.
- **Reference - Documentation:** [NumPy broadcasting and matmul shape rules](https://numpy.org/doc/stable/user/basics.broadcasting.html) - Read General broadcasting rules and Broadcastable arrays, then matmul Notes for stacked matrices and one-dimensional promotion. These close the pool's array-semantics gap.
- **Reference - Theory:** [Fundamentals of Numerical Computation: conditioning and operation counts](https://fncbook.com/python/condition-number/) - Python edition, section 2.8 through Residual and backward error for the fixed-matrix perturbation bound; section 2.5.3 for triangular-solve and LU flop counts. Use Exercise 2.8.7 for a condition-number proof, not the unseeded Hilbert experiment.

### Exit checkpoint

Derive least squares and PCA, implement both from a blank file, and diagnose one rank-deficient or ill-conditioned case.

<details>
<summary>Deliberately left for later</summary>

- Advanced matrix perturbation bounds
- Specialized sparse-direct solvers
- Functional analysis beyond what later tracks require

</details>

## 02. Calculus & Automatic Differentiation

**Why:** Training is repeated differentiation through composed programs. Shape-aware derivatives and numerical checks are the fastest way to separate a wrong model from a wrong implementation.

### Learn this much

- [ ] Limits, local approximation and differentiability _(Required)_
- [ ] Partial and directional derivatives _(Required)_
- [ ] Gradients as local linear models and steepest directions _(Required)_
- [ ] Jacobians, Hessians and consistent shape conventions _(Required)_
- [ ] First- and second-order Taylor approximations _(Required)_
- [ ] Scalar and multivariable chain rule _(Required)_
- [ ] Matrix derivatives for affine, quadratic and least-squares objectives _(Required)_
- [ ] Gradients of logistic, softmax cross-entropy and regularized losses _(Required)_
- [ ] Computational graphs and accumulation through branches _(Required)_
- [ ] Forward mode, reverse mode, JVPs and VJPs _(Required)_
- [ ] Backpropagation through dense layers and nonlinearities _(Required)_
- [ ] Finite-difference gradient checking and its failure modes _(Required)_
- [ ] Hessian-vector products _(Optional)_
- [ ] Implicit differentiation _(Depth)_

### Study units

#### U1. Limits, partial and directional derivatives, and gradients

**About 3 h** · **Target:** Derive

Topics: Limits, local approximation and differentiability; Partial and directional derivatives; Gradients as local linear models and steepest directions

Every later gradient is a stack of directional derivatives. If you cannot compute one by hand and check it numerically, no backward pass output will mean anything to you.

**You can now**

- Compute partial and directional derivatives from the limit definition and evaluate them at a point by hand.
- Explain the gradient as the steepest-ascent direction and relate every directional derivative to it through $`D_u f = \operatorname{grad} f \cdot u`$.
- Convert between row-vector (MML) and column-vector (18.S096) gradient conventions without dropping a transpose.

**Study**

1. [Univariate derivatives, partials and gradients](https://mml-book.github.io/book/mml-book.pdf) (Mathematics for Machine Learning - Ch. 5) - Section 5.1, Differentiation of Univariate Functions (pp. 141-145): difference quotient (5.3), derivative as a limit (5.4), polynomial derivation (5.5)-(5.6), product, quotient, sum and chain rules (5.29)-(5.32). Section 5.2, Partial Differentiation and Gradients (pp. 146-149): partial derivatives, gradient as a row vector, the chain rule as matrix multiplication (5.48)-(5.53).
2. [Derivatives as linear operators](https://ocw.mit.edu/courses/18-s096-matrix-calculus-for-machine-learning-and-beyond-january-iap-2023/resources/mit18_s096iap23_lec02_pdf/) (MIT 18.S096 - Matrix Calculus for ML) - Lecture 1, Part 2 notes (course notes Chapter 2, Sections 2.1-2.3): $`df = f'(x)[dx]`$ as a linear operator, scalar-valued case $`df = (\operatorname{grad} f) \cdot dx`$ with the gradient as the transpose of the derivative.
3. [Gradient geometry and directional derivatives](https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/2.-partial-derivatives/part-b-chain-rule-gradient-and-directional-derivatives/session-35-gradient-definition-perpendicular-to-level-curves/) (MIT 18.02SC - Multivariable Calculus Unit 2) - Sessions 35 to 38 (Part B): gradient definition and perpendicularity to level curves, the proof, a worked example, directional derivatives. Depth: Refresher only. Open only if partial derivatives or gradients are weak; it does not replace the MML derivations.

**Focus**

- The derivative is the limit of the difference quotient; each partial derivative holds all other variables constant.
- For unit $`u`$, $`D_u f = \operatorname{grad} f \cdot u`$, and the maximum over $`u`$ is $`\|\operatorname{grad} f\|`$ at $`u = \operatorname{grad} f / \|\operatorname{grad} f\|`$ by Cauchy-Schwarz.
- MML writes gradients as row vectors and 18.S096 as column vectors; the two differ by a transpose and the chain rule changes shape with the choice.
- Existing partials do not imply differentiability; continuous partials do.

**Reproduce:** Closed-book, differentiate $`f(x_1, x_2) = x_1^2 x_2 + x_1 x_2^3`$ at (1, 2) to get $`\operatorname{grad} f = (12, 13)`$, then the directional derivative along $`u = (1, 1)/\sqrt{2}`$, which is $`25/\sqrt{2}`$ = 17.67766953. Check with float64 NumPy centered differences at $`h = 10^{-5}`$: both components agree within 3e-10 absolute (measured 1.0e-11 and 2.2e-10).

**Traps**

- Reading $`D_u f`$ as a partial derivative. A partial fixes an axis; a directional derivative moves along $`u`$ and needs the full gradient dot product.
- Assuming equal partials imply a smooth function. With $`f(x, y) = x^2 y/(x^4 + y^2)`$ off the origin and $`f(0, 0) = 0`$, both partials at the origin are 0, yet $`f`$ equals 1/2 along $`y = x^2`$, so $`f`$ is discontinuous and not differentiable there.
- Mixing gradient conventions across sources and silently dropping a transpose, which flips every later matrix shape.

**Practice**

- [MML Chapter 5, Exercise 5.5 (partial derivatives and Jacobians)](https://mml-book.github.io/book/mml-book.pdf) - Exercises (pp. 170-171), Exercise 5.5: dimensions of each partial derivative in part (a), then the Jacobians in part (b). Do part (a) before part (b); the predicted dimensions fix the Jacobian shapes.
- [TrenTorch: Directional derivatives](https://trentorch.com/ide/math-directional-derivatives) - Implement directional_derivative(f, x, direction) as a centered difference along the normalized direction, and steepest_ascent_direction(f, x) as the unit gradient. Then run both on the Reproduce cubic at (1, 2): the derivative along (1, 1) must land within 1e-9 of 17.67766953, and the steepest-ascent value must equal $`\|\operatorname{grad} f\| = \sqrt{313}`$ = 17.69180601.

**Stop when:** You compute $`\operatorname{grad} f`$ and any $`D_u f`$ for a new quadratic or cubic by hand, and a float64 centered-difference check at $`h = 10^{-5}`$ agrees to 1e-9 absolute.

<details>
<summary>Self-test</summary>

1. State the difference quotient and the assumption that turns it into the derivative.
   - $`(f(x + h) - f(x))/h`$. The two-sided limit as $`h \to 0`$ must exist. Uses: $`f`$ is defined near $`x`$ for the quotient, and differentiability at $`x`$ for the limit.
2. For $`f(x_1, x_2) = x_1^2 x_2 + x_1 x_2^3`$, give $`\operatorname{grad} f`$ at (1, 2) and $`D_u f`$ for $`u = (1, 1)/\sqrt{2}`$.
   - Partial derivatives are $`2 x_1 x_2 + x_2^3`$ and $`x_1^2 + 3 x_1 x_2^2`$, so $`\operatorname{grad} f = (12, 13)`$ and $`D_u f = (12 + 13)/\sqrt{2} = 25/\sqrt{2}`$ = 17.67766953.
3. Give a function with both partials zero at the origin that is not differentiable there, and the curve that exposes it.
   - $`f(x, y) = x^2 y/(x^4 + y^2)`$ with $`f(0, 0) = 0`$. Both partials at the origin are 0, but along $`y = x^2`$ the value is constantly 1/2, so $`f`$ is discontinuous and hence not differentiable at the origin.
4. MML gives a $`1 \times 2`$ gradient where 18.S096 gives $`2 \times 1`$ for the same $`f: \mathbb{R}^2 \to \mathbb{R}`$. Which is right?
   - Both, by stated convention. MML uses numerator layout (row); 18.S096 uses column gradients with $`df = (\operatorname{grad} f)^\top dx`$. Convert with a transpose and never mix the two inside one derivation.

</details>

#### U2. Jacobians, Hessians and Taylor approximations

**About 3 h** · **Target:** Derive

Topics: Jacobians, Hessians and consistent shape conventions; First- and second-order Taylor approximations

Jacobians say how outputs move; Hessians say how gradients move. Taylor turns both into the local models that justify gradient steps and Newton steps.

**You can now**

- Assemble the Jacobian of a vector-valued map with consistent shapes under a stated layout.
- Write first- and second-order Taylor approximations and bound the remainder from the Hessian size.
- Classify a stationary point from Hessian eigenvalues on a small hand-worked example.

**Study**

1. [Jacobians, Hessians and multivariate Taylor](https://mml-book.github.io/book/mml-book.pdf) (Mathematics for Machine Learning - Ch. 5) - Section 5.3 (pp. 149-154): vector-valued gradients, the Jacobian, the determinant-as-magnifier example, gradient of $`f(x) = Ax`$ in (5.67)-(5.68). Section 5.7 (pp. 164-165): higher-order derivatives and Hessian symmetry for twice continuously differentiable functions. Section 5.8 (pp. 165-169): multivariate Taylor series (5.149)-(5.156) with the worked cubic $`f(x, y) = x^2 + 2xy + y^3`$ at (1, 2): gradient (5.165), Hessian (5.171) and third derivatives (5.174)-(5.176).
2. [Second derivatives, bilinear forms and Hessians](https://ocw.mit.edu/courses/18-s096-matrix-calculus-for-machine-learning-and-beyond-january-iap-2023/resources/mit18_s096iap23_lec12_pdf/) (MIT 18.S096 - Matrix Calculus for ML) - Lecture 7, Part 2 notes (course notes Chapter 12): second derivatives as symmetric bilinear forms, Hessian matrices, minima versus maxima versus saddles.
3. [Second-derivative test in two variables](https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/2.-partial-derivatives/part-a-functions-of-two-variables-tangent-approximation-and-optimization/session-30-second-derivative-test/) (MIT 18.02SC - Multivariable Calculus Unit 2) - Session 30 (Part A): second-derivative test for two-variable functions. Depth: Use only as the 2-D classification check; skip the Lagrange sessions.

**Focus**

- The Jacobian of $`f: \mathbb{R}^n \to \mathbb{R}^m`$ is $`m \times n`$ in numerator layout, and each row is one scalar gradient.
- Hessian symmetry needs continuous second partials. Without $`C^2`$, mixed partials can disagree and the Taylor form breaks.
- The first-order remainder scales with the squared step times the Hessian size; the second-order remainder with the cubed step.
- Eigenvalue signs classify: all positive is a strict local minimum, mixed signs a saddle, a zero eigenvalue leaves the test silent.

**Reproduce:** Closed-book, give the Hessian $`H = \left[\begin{smallmatrix}2&1\\1&2\end{smallmatrix}\right]`$ of $`f(x_1, x_2) = x_1^2 + x_1 x_2 + x_2^2`$, its eigenvalues 1 and 3 from numpy.linalg.eigvalsh, and classify the origin as a strict local minimum since $`H`$ is positive definite. Verify the second-order Taylor model is exact: $`f(0.3, -0.2) = 0.07`$, and $`0.5 d^\top H d`$ in float64 gives 0.06999999999999999, one ulp (1.4e-17) below.

**Traps**

- Calling a stationary point with positive diagonal Hessian entries a minimum. Off-diagonals matter; only definiteness decides.
- Trusting a Taylor model far from the base point. The remainder grows with powers of the step, so recompute rather than extrapolate.
- Switching gradient layout mid-derivation. The layout fixes the Jacobian and Hessian shapes, so a silent switch transposes everything.

**Practice**

- [TrenTorch: Hessian](https://trentorch.com/ide/math-hessian) - Implement hessian(f, x) as the centered-difference Jacobian of the provided gradient, and classify_critical_point(H) from eigvalsh signs with a tolerance. Its tests call diag(1e-9, 2) a saddle, but a near-zero eigenvalue leaves the second-derivative test silent: $`x^4 + y^2`$ has Hessian diag(0, 2) at its minimum. Pass the tests, then return a fourth label for that case in your own copy.
- [MIT 18.S096 Problem Set 1, Problem 0 ($`2 \times 2`$ Jacobian matrices)](https://ocw.mit.edu/courses/18-s096-matrix-calculus-for-machine-learning-and-beyond-january-iap-2023/resources/mit18_s096iap23_pset1_pdf/) - Problem 0, parts (a) to (d): Jacobian matrices of the rotate, hyperbolic rotate, nonlinear shear and warp maps. Official solutions exist; attempt before reading them. Do the hyperbolic rotation by hand; its Jacobian determinant returns in Problem Set 2, Problem 4(a), which calls it Problem 1b.

**Stop when:** You write the Jacobian and second-order Taylor of a new $`\mathbb{R}^2`$ map by hand, classify its stationary point, and NumPy eigvalsh plus a remainder evaluation agree.

<details>
<summary>Self-test</summary>

1. For $`f: \mathbb{R}^3 \to \mathbb{R}^2`$, what is the Jacobian shape and what is its first row?
   - $`2 \times 3`$ in numerator layout. The first row is the (row) gradient of $`f_1`$.
2. Where is the $`C^2`$ assumption used in the claim that the Hessian is symmetric?
   - Continuity of the mixed second partials lets the two differentiation orders agree. The proof step equating the two mixed partials uses exactly this continuity.
3. Approximate $`e^{0.1}`$ with $`T_1`$ about 0. Give the value, the remainder and a bound.
   - $`T_1 = 1.1`$, actual value 1.10517092, remainder 0.00517092. With $`M = e^{0.1}`$ bounding the second derivative on [0, 0.1], $`M h^2/2 = 0.00552585`$, and the remainder satisfies the bound.
4. Classify the stationary point with Hessian $`\left[\begin{smallmatrix}2&1\\1&2\end{smallmatrix}\right]`$.
   - Eigenvalues 1 and 3, both positive, so the Hessian is positive definite and the point is a strict local minimum.

</details>

#### U3. The chain rule and matrix derivatives

**About 4 h** · **Target:** Derive

Topics: Scalar and multivariable chain rule; Matrix derivatives for affine, quadratic and least-squares objectives

Matrix backprop is the chain rule with shapes. Differentials keep the product order that index notation hides, and that order decides the flop count.

**You can now**

- Differentiate composite scalar, vector and matrix functions with differentials and the operator chain rule.
- Derive $`d(X^{-1}) = -X^{-1} dX X^{-1}`$ and gradients of affine, quadratic and trace objectives with correct shapes.
- Predict Jacobian accumulation cost for a chain of maps and choose left-to-right versus right-to-left order.

**Study**

1. [Operator chain rule and the inverse differential](https://ocw.mit.edu/courses/18-s096-matrix-calculus-for-machine-learning-and-beyond-january-iap-2023/resources/mit18_s096iap23_lec02_pdf/) (MIT 18.S096 - Matrix Calculus for ML) - Lecture 1, Part 2 notes (course notes Chapter 2, Sections 2.4-2.6): operator sum, product and chain rules, $`d(A^3) = A^2 dA + A dA A + dA A^2`$, $`d(A^{-1}) = -A^{-1} dA A^{-1}`$, forward versus reverse Jacobian accumulation.
2. [Jacobians of matrix functions](https://ocw.mit.edu/courses/18-s096-matrix-calculus-for-machine-learning-and-beyond-january-iap-2023/resources/mit18_s096iap23_lec03_pdf/) (MIT 18.S096 - Matrix Calculus for ML) - Lecture 2, Part 2 notes (course notes Chapter 3): the Jacobian of a matrix function via $`\operatorname{vec}`$, the $`4 \times 4`$ Jacobian of matrix squaring, the identity $`(A \otimes B) \operatorname{vec}(C) = \operatorname{vec}(BCA^\top)`$, and why forming Kronecker Jacobians costs $`m^4`$ (Section 3.3.3). Depth: Read for the vec picture only; compute gradients with the Frobenius route in the next item.
3. [Gradients in general vector spaces](https://ocw.mit.edu/courses/18-s096-matrix-calculus-for-machine-learning-and-beyond-january-iap-2023/resources/mit18_s096iap23_lec05_pdf/) (MIT 18.S096 - Matrix Calculus for ML) - Lecture 4, Part 1 notes (course notes Section 5.1): the Frobenius inner product $`\operatorname{tr}(A^\top B)`$, gradients of matrix-input functions read off $`df = \operatorname{tr}(G^\top dA)`$, with the Frobenius-norm and $`x^\top Ay`$ (gradient $`xy^\top`$) examples.
4. [Matrix gradients and gradient identities](https://mml-book.github.io/book/mml-book.pdf) (Mathematics for Machine Learning - Ch. 5) - Sections 5.2.2 and 5.4-5.5 (pp. 148-149, 155-158): chain rule as matrix multiplication, gradients of matrices, identities (5.99)-(5.108) covering transpose, trace, determinant, inverse, $`a^\top Xb`$ and $`x^\top Bx`$.
5. [Derivative of the determinant and inverse](https://ocw.mit.edu/courses/18-s096-matrix-calculus-for-machine-learning-and-beyond-january-iap-2023/resources/mit18_s096iap23_lec07_pdf/) (MIT 18.S096 - Matrix Calculus for ML) - Lecture 5, Part 1 (course notes Chapter 7): derivative of the matrix determinant and inverse, including $`d \log \det X = \operatorname{tr}(X^{-1} dX)`$.

**Focus**

- $`d(fg) = (df)g + f(dg)`$ keeps factor order. Matrices do not commute, so $`d(A^3)`$ has three distinct terms.
- $`d(X^{-1})`$ comes from differentiating the constant $`XX^{-1} = I`$; the final left-multiplication by $`X^{-1}`$ needs $`X`$ to be invertible.
- Read gradients off differentials with the Frobenius product: $`df = \operatorname{tr}(G^\top dX)`$ means $`\operatorname{grad} f = G`$.
- For three or more composed maps, accumulate Jacobians from the small side. Scalar-output chains go left to right.

**Reproduce:** Closed-book, derive $`d(X^{-1}) = -X^{-1} dX X^{-1}`$ from $`d(XX^{-1}) = 0`$. Check in float64 NumPy with $`X = \left[\begin{smallmatrix}3&1\\1&2\end{smallmatrix}\right], V = \left[\begin{smallmatrix}0.5&-0.25\\0.25&0.5\end{smallmatrix}\right], h = 10^{-5}`$: $`\|(X + hV)^{-1} - (X^{-1} - h X^{-1} V X^{-1})\|_F`$ = 9.3e-12, a scaled residual of 0.093, consistent with an $`O(h^2)`$ remainder.

**Traps**

- Writing $`d(A^3) = 3 A^2 dA`$. By hand with $`A = \left[\begin{smallmatrix}0&1\\0&0\end{smallmatrix}\right]`$ and $`dA = \left[\begin{smallmatrix}0&0\\1&0\end{smallmatrix}\right]`$: $`A^2 = 0`$ so $`3 A^2 dA = 0`$, but the product rule gives $`A dA A = A`$, which is nonzero.
- Forming a vec-Kronecker Jacobian to get a gradient. The differential plus the Frobenius product gives the gradient with no $`n^2 \times n^2`$ matrix.
- Quoting $`d \log \det X`$ without invertibility. The formula needs invertible $`X`$; the det gradient $`\det(X)(X^{-1})^\top`$ shows the same requirement.

**Practice**

- [MIT 18.S096 Problem Set 1, Problems 1 and 2 (operator and matrix derivatives)](https://ocw.mit.edu/courses/18-s096-matrix-calculus-for-machine-learning-and-beyond-january-iap-2023/resources/mit18_s096iap23_pset1_pdf/) - Problem 1 (linear-operation derivatives including transpose and trace) and Problem 2 (gradients, Jacobians and linear operators, including the $`\Theta(n^2)`$ Sherman-Morrison argument). Official solutions exist; attempt before reading them. Write every answer as $`f'(x)[dx]`$ first, then convert to the requested Jacobian or gradient form.

**Stop when:** You derive $`d(X^{-1})`$ and one trace or quadratic gradient closed-book with shapes stated, and a NumPy finite-difference check agrees to 1e-9 relative.

<details>
<summary>Self-test</summary>

1. Derive $`d(X^{-1})`$ and name the step where invertibility is used.
   - $`XX^{-1} = I`$ is constant, so $`(dX)X^{-1} + X d(X^{-1}) = 0`$ by the product rule. Left-multiplying by $`X^{-1}`$ needs $`X`$ invertible, giving $`d(X^{-1}) = -X^{-1} dX X^{-1}`$.
2. For $`f(X) = \operatorname{tr}(AXB)`$, give $`\operatorname{grad} f`$ and the cyclic step.
   - $`df = \operatorname{tr}(A dX B) = \operatorname{tr}(BA dX)`$ by $`\operatorname{tr}(ABC) = \operatorname{tr}(CAB)`$, so $`\operatorname{grad} f = (BA)^\top = A^\top B^\top`$ under the Frobenius product.
3. Chain $`\mathbb{R}^{100} \to \mathbb{R}^{50} \to \mathbb{R}^{20} \to \mathbb{R}^1`$: which accumulation order, with flop counts?
   - Left to right (reverse mode). Jacobians are $`1 \times 20`$, $`20 \times 50`$, $`50 \times 100`$: left-to-right costs $`1 \times 20 \times 50 + 1 \times 50 \times 100 = 6000`$ multiplications, right-to-left costs $`20 \times 50 \times 100 + 1 \times 20 \times 100 = 102000`$. Reverse wins by about 17x.
4. Problem Set 1, Problem 2(b)(ii) computes a Jacobian in $`\Theta(n^2)`$ given $`A^{-1}`$. What is the structural reason?
   - With $`M = A + yx^\top`$, $`df = -M^{-1} y (dx^\top f)`$, so the Jacobian is the rank-1 outer product $`-(M^{-1} y) f(x)^\top`$. Sherman-Morrison gives $`M^{-1} v = A^{-1} v - A^{-1} y (x^\top A^{-1} v)/(1 + x^\top A^{-1} y)`$, $`\Theta(n^2)`$ per vector once $`A^{-1}`$ is known, so $`f(x)`$, $`M^{-1} y`$ and their outer product each cost $`\Theta(n^2)`$.

</details>

#### U4. Gradients of logistic, softmax cross-entropy and regularized losses

**About 3 h** · **Target:** Derive

Topics: Gradients of logistic, softmax cross-entropy and regularized losses

These three gradients are the output layer of almost every classifier you will train. Derive them once and later frameworks only change the packaging.

**You can now**

- Derive the logistic sigmoid derivative, the binary-cross-entropy-with-logits gradient $`(p - y)x`$, and the softmax cross-entropy gradient $`p`$ minus one-hot.
- Implement the three gradients in NumPy and confirm each against centered differences with a stated tolerance.
- Explain why max-subtraction leaves softmax probabilities unchanged and where the naive formula overflows.

**Study**

1. [Sigmoid, quadratic and regularizer gradients](https://mml-book.github.io/book/mml-book.pdf) (Mathematics for Machine Learning - Ch. 5) - Exercise 5.2 setup (p. 170): derivative of the logistic sigmoid $`1/(1 + \exp(-x))`$. Identities (5.103)-(5.108) (p. 158): $`a^\top X^{-1} b`$, $`a^\top Xb`$, $`x^\top Bx`$ and the weighted least-squares gradient (5.108). Least-squares linear-model pattern (5.75)-(5.78) (p. 154).
2. [Softmax classifier and numeric stability](https://cs231n.github.io/linear-classify/#softmax-classifier) (CS231n - Linear Classification) - Softmax classifier section: cross-entropy loss $`L_i = -f_{y_i} + \log \sum_j e^{f_j}`$ with the information-theory and MLE views. Practical issues: Numeric stability: max-subtraction trick with the [123, 456, 789] overflow example. Depth: Read the loss formula and the stability trick only. Derive the gradient yourself in Reproduce; skip the SVM sections and the interactive demo.

**Focus**

- $`\operatorname{sigmoid}'(x) = \operatorname{sigmoid}(x)(1 - \operatorname{sigmoid}(x))`$ falls out of $`\exp' = \exp`$; the $`(p - y)`$ factor comes from $`dL/dp`$ cancelling $`dp/ds`$.
- The softmax cross-entropy gradient is p minus one-hot because the logsumexp derivative is the softmax itself.
- $`L_2`$ adds $`\lambda w`$ under the $`(\lambda/2)\|w\|^2`$ convention and $`2 \lambda w`$ under $`\lambda\|w\|^2`$. State the convention before comparing numbers.
- Max-subtraction is exact in real arithmetic since it multiplies top and bottom by one constant; it only changes float rounding, which the check measures.

**Reproduce:** Closed-book, derive $`\operatorname{sigmoid}' = \operatorname{sigmoid}(1 - \operatorname{sigmoid})`$, the binary-cross-entropy-with-logits gradient $`(p - y)x`$, and the softmax cross-entropy gradient $`p - e_y`$. Check in float64 NumPy: $`z = [2.0, 1.0, 0.1]`$ with $`y = 0`$ gives $`p = [0.659001, 0.242433, 0.098566]`$, loss 0.417030, grad [-0.340999, 0.242433, 0.098566]; max-subtracted softmax agrees with naive to 2.8e-17. A single logistic example ($`w = [1, 2]`$, $`x = [0.5, -1]`$, $`b = 0.5`$, $`y = 1`$) gives $`p = 0.268941`$ and $`dL/dw = [-0.365529, 0.731059]`$.

**Traps**

- Averaging versus summing the batch loss changes the gradient by $`1/m`$. A mismatched convention looks like a wrong derivation.
- Feeding probabilities into a logsumexp. Softmax cross-entropy needs logits; probabilities double-apply the exponential.
- Reading softmax outputs as calibrated probabilities. The CS231n notes show that a stronger regularization shrinks the weights and makes the same example's probabilities more diffuse, so only their ordering is meaningful.

**Practice**

- [MML Chapter 5, Exercise 5.2 (logistic sigmoid derivative)](https://mml-book.github.io/book/mml-book.pdf) - Exercises (p. 170), Exercise 5.2: derivative of $`f(x) = 1/(1 + \exp(-x))`$. Derive the softmax cross-entropy gradient beside it and check all three gradients with the Reproduce script.

**Stop when:** Your hand-derived sigmoid, binary-cross-entropy and softmax gradients all match centered differences to 1e-9 relative, and you can state the L2 convention from memory.

<details>
<summary>Self-test</summary>

1. Derive the logistic sigmoid derivative. Which rule and fact?
   - $`\operatorname{sigmoid}(x) = (1 + e^{-x})^{-1}`$. Chain rule with $`d/dx e^{-x} = -e^{-x}`$ gives $`\operatorname{sigmoid}(x)(1 - \operatorname{sigmoid}(x))`$.
2. One logistic example with $`s = w^\top x + b`$ and $`L = -[y \log p + (1 - y) \log(1 - p)]`$: show $`dL/dw = (p - y)x`$.
   - $`dL/dp = (p - y)/(p(1 - p))`$ and $`dp/ds = p(1 - p)`$, so the product is $`p - y`$; times $`ds/dw = x`$. The cancellation needs $`p`$ strictly inside (0, 1).
3. Derive $`dL/dz`$ for softmax cross-entropy with true class $`y`$.
   - $`L = -z_y + \operatorname{logsumexp}(z)`$ and $`d/dz_j \operatorname{logsumexp}(z) = p_j`$, so the gradient is $`p - e_y`$.
4. The loss uses $`(\lambda/2)\|w\|^2`$ in one source and $`\lambda\|w\|^2`$ in another. What changes in the gradient?
   - $`\lambda w`$ versus $`2 \lambda w`$. The minimizers agree only after rescaling $`\lambda`$, so report the convention with every number.

</details>

#### U5. Forward mode, reverse mode, JVPs, VJPs and Hessian-vector products

**About 4 h** · **Target:** Derive + Implement

Topics: Computational graphs and accumulation through branches; Forward mode, reverse mode, JVPs and VJPs; Hessian-vector products

One reverse pass costs about one forward pass while forward mode costs one pass per input. That cost model decides how every large model is differentiated.

**You can now**

- Explain forward mode (JVP) and reverse mode (VJP) and choose between them from input and output counts.
- Implement forward-mode dual numbers and a reverse-mode accumulation for a small graph without forming any Jacobian.
- Compute a Hessian-vector product by forward-over-reverse or double backward and check it against a finite difference of gradients.

**Study**

1. [Forward and reverse-mode automatic differentiation](https://ocw.mit.edu/courses/18-s096-matrix-calculus-for-machine-learning-and-beyond-january-iap-2023/resources/mit18_s096iap23_lec08_pdf/) (MIT 18.S096 - Matrix Calculus for ML) - Lecture 5, Part 3 notes (course notes Chapter 8, Sections 8.1 and 8.4): forward mode via dual numbers with the Babylonian square-root example, the cost rule (forward scales with inputs, reverse with outputs) and forward-over-reverse Hessian-vector products (Section 8.4.1).
2. [Dual numbers and both AD engines](https://github.com/ageron/handson-mlp/blob/main/Appendix_A_autodiff.ipynb) (Hands-On ML - Autodiff notebook) - Cells Forward mode autodiff using dual numbers (DualNumber class; seeding x gives 24.0 and seeding y gives 10.0 for f at (3, 4)), Reverse mode autodiff (toy engine with backpropagate on the same f), Reverse mode autodiff using PyTorch (torch.autograd.grad with create_graph=True for second order). Depth: Rebuild the dual-number and reverse engines independently in your own file; do not copy the notebook cells.
3. [Backpropagation cost and graph equations](https://mml-book.github.io/book/mml-book.pdf) (Mathematics for Machine Learning - Ch. 5) - Section 5.6 (pp. 159-164): explicit gradient (5.109)-(5.110) motivating the cost worry, forward and backward graph computation with accumulation over parents (5.135)-(5.145), reverse mode cheaper when inputs outnumber labels.
4. [Reverse-mode graph, accumulation and grad modes](https://docs.pytorch.org/docs/stable/notes/autograd) (PyTorch Autograd mechanics) - How autograd encodes the history (reverse-mode graph recording); accumulation into .grad and torch.autograd.grad as a vector-Jacobian product; Grad Modes with Default, No-grad and Inference behavior. Depth: Consult after your handwritten engine. Skip multithreading and in-place correctness checks.

**Focus**

- A JVP pushes a tangent forward ($`Jv`$, one column); a VJP pulls a cotangent back ($`v^\top J`$, one row). Forward cost scales with $`n`$ inputs, reverse with $`m`$ outputs.
- Reverse mode must keep or recompute forward values. That memory-for-time trade is the price of the single pass.
- Dual numbers evaluate $`f(x + \epsilon) = f(x) + f'(x) \epsilon`$ exactly since $`\epsilon^2 = 0`$; seeding each input in turn gives one gradient column per pass.
- An HVP is the JVP of the gradient. It needs $`C^2`$ so the differentiation order does not matter.

**Reproduce:** Closed-book, implement a minimal DualNumber type ($`\epsilon^2 = 0`$) and recover $`df/dx = 24.0`$ and $`df/dy = 10.0`$ for $`f(x, y) = x^2 y + y + 2`$ at (3, 4), matching the notebook analytic values. State the cost rule: $`n`$ inputs with 1 output take 1 reverse pass versus $`n`$ forward passes. Verify an HVP without forming $`H`$ on $`f(x) = 0.5 x^\top Ax + b^\top x`$ in $`\mathbb{R}^3`$ with $`A = M + M^\top + 3I`$, drawing $`M`$ ($`3 \times 3`$), $`b`$, $`x`$ and $`v`$ in that order with standard_normal from numpy.random.default_rng(11) in float64: the centered difference $`(\operatorname{grad} f(x + hv) - \operatorname{grad} f(x - hv))/(2h)`$ at $`h = 10^{-5}`$ misses $`Av`$ by 2.2e-11 in the 2-norm. The gradient is linear, so that gap is rounding alone.

**Traps**

- Building the full Jacobian to get one JVP or VJP. Propagate the vector instead; the matrix is never needed.
- Calling torch.autograd.functional.jacobian for a check on wide maps. It materializes the matrix; use grad (a VJP) or directional differences.
- Assuming reverse mode always wins. For $`\mathbb{R}^1 \to \mathbb{R}^N`$, one forward pass beats $`N`$ reverse passes, so count outputs before choosing.

**Practice**

- [MIT 18.S096 Problem Set 2, Problem 1(c) (adjoint gradient plus finite-difference test)](https://ocw.mit.edu/courses/18-s096-matrix-calculus-for-machine-learning-and-beyond-january-iap-2023/resources/mit18_s096iap23_pset2_pdf/) - Problem 1(c): implement the two-solve adjoint gradient procedure and test $`\operatorname{grad} f \cdot dp`$ against $`f(p + dp) - f(p)`$ on random $`a`$, $`b`$, $`c`$, $`p`$. Official solutions exist; attempt before reading them. Parts (a) and (b) derive the adjoint form; part (c) is the implementation. Record the generator, seed and dtype.

**Stop when:** Your dual-number gradient matches (24.0, 10.0), your HVP matches a finite difference of gradients to 1e-9, and you pick the AD mode from $`(n, m)`$ without notes.

<details>
<summary>Self-test</summary>

1. Compare forward and reverse cost for $`f: \mathbb{R}^{1000} \to \mathbb{R}`$.
   - Reverse costs about one forward pass; forward costs about 1000 passes, one per input. Uses: each primitive JVP or VJP costs $`O(1)`$ forward equivalents.
2. What do a JVP and a VJP compute, and which one does torch.autograd.grad perform?
   - JVP computes $`Jv`$ (pushforward of a tangent); VJP computes $`v^\top J`$ (pullback of a cotangent). torch.autograd.grad performs a VJP.
3. Give the two HVP routes and the assumption each needs.
   - Forward-over-reverse (JVP of the gradient) or double backward (VJP of the gradient). Both need $`C^2`$ so mixed partials agree and the order is irrelevant.
4. Why does reverse mode store forward values?
   - Local pullbacks need operand values (for example $`d(ab)`$ needs $`a`$ and $`b`$). The forward pass saves them; recomputation trades time for memory.

</details>

#### U6. Backpropagation through dense layers and gradient checks

**About 3 h** · **Target:** Derive + Implement

Topics: Backpropagation through dense layers and nonlinearities; Finite-difference gradient checking and its failure modes

Backprop hides a sign, transpose or accumulation bug in every new layer. A two-evaluation directional check finds it in seconds; a per-coordinate loop costs $`2mn`$ evaluations.

**You can now**

- Derive backprop through an affine map, an elementwise nonlinearity and a branched sum, with shapes stated.
- Implement centered-difference gradient checks including random-direction tests for matrix parameters, with tolerance and norm stated.
- Diagnose step-size, cancellation, nondifferentiability and stochastic-state failures from the error curve.

**Study**

1. [Finite-difference approximations and their errors](https://ocw.mit.edu/courses/18-s096-matrix-calculus-for-machine-learning-and-beyond-january-iap-2023/resources/mit18_s096iap23_lec04_pdf/) (MIT 18.S096 - Matrix Calculus for ML) - Lecture 3, Part 2 notes (course notes Chapter 4): forward differences and first-order truncation error (Sections 4.2-4.5), roundoff and the step-size rule of thumb (Section 4.6), centered differences and Richardson extrapolation (Section 4.7).
2. [Numeric differentiation and the reverse engine](https://github.com/ageron/handson-mlp/blob/main/Appendix_A_autodiff.ipynb) (Hands-On ML - Autodiff notebook) - Cells Numeric differentiation (gradients() takes one-sided differences with eps = 1e-4 and n + 1 calls; nesting it gives a Hessian whose exact 0 entry prints as -1.4e-6) and Reverse mode autodiff (hand engine with backpropagate, the artifact to test against differences).
3. [Backprop equations with parent accumulation](https://mml-book.github.io/book/mml-book.pdf) (Mathematics for Machine Learning - Ch. 5) - Section 5.6 (pp. 160-164): backward computation working from the output with accumulation over parent nodes (5.135)-(5.145); the dense-layer backward pattern.
4. [Reverse mode on computational graphs](https://ocw.mit.edu/courses/18-s096-matrix-calculus-for-machine-learning-and-beyond-january-iap-2023/resources/mit18_s096iap23_lec08_pdf/) (MIT 18.S096 - Matrix Calculus for ML) - Lecture 5, Part 3 notes (course notes Chapter 8, Section 8.3): computational graphs, summing products along every input-to-output path, and reverse mode on graphs (Section 8.3.1).

**Focus**

- Centered differences carry $`O(h^2)`$ error until rounding at about $`\epsilon/h`$ takes over; $`h = 10^{-5}`$ in float64 sits near the bottom of that U-curve.
- The random-direction test $`\langle G, V \rangle`$ against the directional difference needs 2 evaluations for any shape and catches transpose and scale bugs. Use several seeded $`V`$.
- Backprop through a branch sums cotangents from every downstream use. A missing accumulation is the classic silent bug.
- Relative error needs a scale: use $`\|\text{num} - \text{ana}\| / (\|\text{num}\| + \|\text{ana}\|)`$ so near-zero gradients do not explode the ratio.

**Reproduce:** Closed-book, backpropagate $`L = 0.5\|\tanh(Wx + b) - t\|^2`$ with $`W`$ ($`2 \times 3`$), $`b`$ ($`2`$), $`x`$ ($`3`$), $`t`$ ($`2`$) and direction $`V`$ ($`2 \times 3`$) drawn in that order with standard_normal from numpy.random.default_rng(5) in float64: $`\delta = (a - t) \odot (1 - a^2)`$, $`dL/dW = \delta x^\top`$. Measured: $`L`$ = 1.73395370, centered differences ($`h = 10^{-5}`$) give relative error $`\|\text{num} - \text{ana}\|/(\|\text{num}\| + \|\text{ana}\|)`$ = 3.4e-11, and the direction test $`|\langle dW, V \rangle - (L(W + hV) - L(W - hV))/(2h)|`$ = 1.4e-10. Repeat at $`h = 0.1`$ to get relative error 4.3e-3, consistent with $`O(h^2)`$ truncation.

**Traps**

- Checking at one $`h`$ far from $`10^{-5}`$ without a sweep. For the tanh layer in Reproduce, $`h = 0.1`$ leaves 4.3e-3 relative error and hides real bugs above the truncation floor, while $`h = 10^{-12}`$ drowns in cancellation.
- Gradchecking through a kink or a stochastic op and reading the mismatch as a backprop bug. Freeze stochasticity and keep nondifferentiable points out of the check.
- Comparing with == or to too many digits. State the norm and tolerance; for the tanh layer, float64 centered differences bottom out near 1e-10, not 1e-16.

**Practice**

- [Deep-ML 313: Numerical Gradient Checking](https://www.deep-ml.com/problems/313) - Implement numerical_gradient_check(f, x, analytical_grad, epsilon) with centered differences; tests check quadratics against rel_err < 1e-5. The signature defaults epsilon to 1e-7. Sweep $`h`$, explain why 1e-5 is safer in float64, then keep your dense-layer check from Reproduce as the oracle the section mini-project extends with a seeded gradient error.

**Stop when:** Your dense-layer backward matches centered differences to 1e-8 relative and a directional test to 1e-9 absolute, and you can move the error up and down the U-curve by changing $`h`$.

<details>
<summary>Self-test</summary>

1. Write the backward pass for $`z = Wx + b`$, $`a = \tanh(z)`$, $`L = 0.5\|a - t\|^2`$, with shapes.
   - $`\delta = (a - t) \odot (1 - a^2)`$, shape $`m`$. $`dL/dW = \delta x^\top`$ ($`m \times n`$), $`dL/db = \delta`$, $`dL/dx = W^\top \delta`$. The outer product, not an inner product, gives $`m \times n`$.
2. Why is centered $`O(h^2)`$ while one-sided is $`O(h)`$?
   - Taylor expansion: the forward difference leaves a first-order term $`f''h/2`$, while centering cancels all odd powers of $`h`$, leaving $`O(h^2)`$. The remainder form needs $`C^3`$.
3. $`W`$ has 6 entries. Compare per-coordinate and directional check cost.
   - Per-coordinate costs 12 evaluations; one direction costs 2. Run 3 to 5 random directions from a seeded generator and record the seed, dtype and norm.
4. The check disagrees only at entries whose pre-activation sits near zero under ReLU. Is backprop wrong?
   - Probably not. Centered differences average left and right slopes at a nondifferentiable kink. Move the check point or use a smooth activation for the check.

</details>

### Mini-project: A small reverse-mode engine and a matrix-calculus gradient-check harness

**About 8 to 12 hours.** Add autodiff/ to numlab: a scalar reverse-mode engine, forward-mode duals, and a harness that checks closed-form matrix gradients with seeded directional finite differences. Derive a branched matrix computation by hand, then plant a gradient bug and show the harness isolating it.

1. Write a scalar Value class with +, -, *, /, a constant power, exp, log and tanh, each with its local derivative, and a backward() that visits a topological order and adds into .grad. Test a graph in which one node reaches the output through three paths against a hand derivative and central differences.
2. Add forward mode with dual numbers. For a function from $`\mathbb{R}^3 \to \mathbb{R}^2`$, check that your Jacobian-vector and vector-Jacobian products agree through $`u^\top(Jv) = (J^\top u)^\top v`$ for seeded random $`u`$ and $`v`$.
3. Build the matrix harness: a function check(f, grad, X, V, h) that compares $`\langle \operatorname{grad}(X), V \rangle`$ with $`(f(X + hV) - f(X - hV))/(2h)`$. Derive and check $`\operatorname{tr}(AXB)`$, $`\log \det X`$ on a symmetric positive definite $`X`$, softmax cross-entropy and the $`\tanh`$ layer from the backprop unit, then the matrix differential $`d(X^{-1}) = -X^{-1} V X^{-1}`$ against centered differences of the inverse, each in float64 with seeded directions.
4. Sweep $`h`$ over powers of ten from 1e-1 to 1e-12 for two of these checks and keep the raw table. In float64 the error falls as $`h^2`$ down to about $`h = 10^{-5}`$ and then rises again as cancellation takes over. Explain both arms of the curve and choose the $`h`$ and the tolerance your harness uses from it.
5. Derive by hand the gradient of a branched matrix computation in which one matrix is used twice, for example $`L = 0.5\|\tanh(WX + b) - T\|_F^2 + \lambda \operatorname{tr}(W^\top W)`$, writing each local vector-Jacobian product and the accumulation. Implement it in NumPy and check it with the harness. Add a Hessian-vector product by centered differences of your analytic gradient and compare it with the exact Hessian of a quadratic.
6. Plant one gradient bug: a missing transpose, an overwrite instead of an accumulation on the shared matrix, or a wrong sign in the tanh derivative. Show the directional check failing, then localize the bug by checking each local vector-Jacobian product on its own. Keep the planted bug as a test that must fail.

**Deliverables**

- numlab/autodiff/: the scalar reverse-mode engine, forward-mode duals and the gradient-check harness.
- The tests: shared-path accumulation, the JVP-VJP identity, five closed-form matrix gradients, the branched derivation, the Hessian-vector product and the planted-bug test.
- notes/calculus.md: the branched derivation and the h-sweep table with the chosen step and tolerance.

**Checks**

- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Engine correctness | Every operation matches central differences within a stated tolerance, including a node reached through three paths. | Forward and reverse mode agree through the dot-product identity on seeded random vectors. |
| Matrix gradients | The five closed forms pass the directional check in float64. | Each closed form is derived in the notes from differentials, with the assumption it needs, such as an invertible or positive definite X. |
| Step size | The $`h`$ sweep is kept as raw output and the chosen $`h`$ sits near its minimum. | The note explains the truncation and cancellation arms and derives the tolerance from them. |
| Fault isolation | The planted bug fails the directional check and stays in the suite as a failing case. | The localization procedure checks local products one at a time and names the faulty operation. |

Feeds into: Capstone component 2, reverse-mode differentiation: the engine, the harness and the planted-bug regression. The Deep Learning stage grows the engine into a tensor engine.

### Resource route

- **Primary - Course:** [MIT 18.S096 - Matrix Calculus for ML](https://ocw.mit.edu/courses/18-s096-matrix-calculus-for-machine-learning-and-beyond-january-iap-2023/pages/lecture-notes-and-readings/) - Use lectures 1-5, the Hessian portion of lecture 7 and computational-graph portion of lecture 8; do the supplied problems and notebooks.
- **Required - Implementation:** [Hands-On ML - Autodiff notebook](https://github.com/ageron/handson-mlp/blob/main/Appendix_A_autodiff.ipynb) - Work through numerical differentiation and both AD modes, then rebuild the essential reverse-mode engine independently.
- **Required - Reference:** [PyTorch Autograd mechanics](https://docs.pytorch.org/docs/stable/notes/autograd) - Consult after the handwritten engine for accumulation, graph behavior, disabled tracking and vector-Jacobian products.
- **Reference - Theory:** [Mathematics for Machine Learning - Ch. 5](https://mml-book.github.io/) - Use Chapter 5 as the compact derivative, Jacobian, chain-rule and backpropagation reference.
- **Optional - Refresher:** [MIT 18.02SC - Multivariable Calculus Unit 2](https://ocw.mit.edu/courses/18-02sc-multivariable-calculus-fall-2010/pages/2.-partial-derivatives/) - Use sessions 24-38 only if partial derivatives, gradients, Hessians or the multivariable chain rule are weak.
- **Support - Reference:** [CS231n - Linear Classification](https://cs231n.github.io/linear-classify/) - Read the Softmax classifier section for the cross-entropy loss formula with both the information-theory and MLE views, and Practical issues: Numeric stability for the max-subtraction trick. Derive the softmax gradient by hand; do not implement the course assignment here.

### Exit checkpoint

Derive a branched matrix computation, implement a small reverse-mode autodiff engine, and isolate a seeded gradient error.

<details>
<summary>Deliberately left for later</summary>

- General differential geometry
- Full symbolic differentiation systems
- Higher-order implicit differentiation

</details>

## 03. Probability, Information & Bayesian Reasoning

**Why:** Model outputs, losses, sampling and uncertainty all depend on conditioning correctly and keeping the data-generating assumptions visible.

### Learn this much

- [ ] Sample spaces, events and probability axioms _(Required)_
- [ ] Random variables, PMFs, PDFs and CDFs _(Required)_
- [ ] Joint, marginal and conditional distributions _(Required)_
- [ ] Independence and conditional independence _(Required)_
- [ ] Expectation, variance, covariance and correlation _(Required)_
- [ ] Total probability, expectation and variance _(Required)_
- [ ] Bernoulli, binomial, categorical, Gaussian, exponential and Poisson families _(Required)_
- [ ] Transformations of random variables _(Required)_
- [ ] Bayes rule, likelihood, evidence and posterior _(Required)_
- [ ] Conditional expectation _(Required)_
- [ ] Law of large numbers and central-limit behavior _(Required)_
- [ ] Concentration bounds and what breaks under dependence or heavy tails _(Required)_
- [ ] Monte Carlo estimation and sampling error _(Required)_
- [ ] Entropy, cross-entropy, KL divergence and mutual information _(Required)_
- [ ] Priors, conjugacy, posterior predictive distributions and sensitivity _(Required)_
- [ ] Simple graphical factorization and latent variables _(Optional)_
- [ ] Measure-theoretic probability _(Depth)_

### Study units

#### U1. Probability axioms and random variables

**About 3 h** · **Target:** Explain + Derive

Topics: Sample spaces, events and probability axioms; Random variables, PMFs, PDFs and CDFs

Every later loss, sampler and posterior conditions on an event. A vague sample space now becomes a wrong conditional later.

**You can now**

- Explain sample spaces, events, probability mass functions, density functions and cumulative distribution functions, and state when each one applies.
- Derive a probability in a new finite model by counting, and check it by exact arithmetic and by simulation with a stated seed.

**Study**

1. [Sample spaces, counting and axioms](https://www.youtube.com/watch?v=KbB0FjPg0mw&list=PL2SOU6wwxB0uwwH80KTQ6ht66KWxbzTIo) (Harvard Stat 110 - Probability) - Lectures 1 to 3: naive definition, counting, axioms and inclusion-exclusion.
2. [Random variables, PMFs, PDFs and CDFs](https://www.youtube.com/watch?v=PNrqCdslGi4&list=PL2SOU6wwxB0uwwH80KTQ6ht66KWxbzTIo) (Harvard Stat 110 - Probability) - Lectures 7 and 8: Bernoulli and Binomial variables, CDFs, PMFs and Hypergeometric.
3. [Counting and discrete-variable drills](https://stat110.hsites.harvard.edu/sites/g/files/omnuum10111/files/stat110/files/strategic_practice_and_homework_1.pdf) (Stat 110 Strategic Practice) - Strategic Practice: Naive Definition Q1-4 and Story Proofs Q5-7; Homework Q1-7.
4. [Probability and random-variable notation](https://probml.github.io/book1) (Probabilistic Machine Learning: An Introduction) - Chapter 2, Sections 2.1-2.2.2 (pp. 33-38): events, the conditional-probability definition, discrete and continuous variables, CDFs and quantiles.

**Focus**

- The naive definition needs finite and equally likely outcomes. State both assumptions before counting.
- A PMF gives probabilities that sum to 1. A density does not: only its integral over a set is a probability, and a density value can exceed 1.
- The CDF $`F(x)=P(X \le x)`$ works for every variable type and determines the distribution.
- Universality: for continuous $`X`$ with CDF $`F`$, $`F(X)`$ is $`\operatorname{Uniform}(0,1)`$. This is the seed of inverse-CDF sampling in the transforms unit.

**Reproduce:** Closed-book, count $`P(\text{sum of two fair dice}=9)=4/36=1/9`$ from the 36 ordered pairs. Then check with NumPy in float64: numpy.random.default_rng(7), a (200000, 2) int64 array from integers(1, 7); the fraction of sums equal to 9 is 0.11259 with standard error 0.00071, within about 2 standard errors of 1/9.

**Traps**

- Reading a density value as a probability. For continuous $`X`$, $`P(X=x)=0`$; report $`P(X \in \text{an interval})`$ instead.
- Calling an outcome random without a distribution. Name the set, the probabilities on it and the sampling scheme.
- Assuming distinct-looking formulas give distinct distributions. Compare the CDF or the PMF values, which settle identity.

**Practice**

- [Stat 110 Strategic Practice 1: Naive Definition Q1-4 and Story Proofs Q5-7](https://stat110.hsites.harvard.edu/sites/g/files/omnuum10111/files/stat110/files/strategic_practice_and_homework_1.pdf) - Strategic Practice Q1-7 with the inline solutions; Homework Q1-7 for counting drills. Attempt each problem before reading its solution. The solutions are printed in the same file.

**Stop when:** You derive the 1/9 by counting without notes, your rerun of the seed-7 simulation matches 0.11259 to 4 decimals, and you can state for any new finite model whether naive counting applies.

<details>
<summary>Self-test</summary>

1. Two dice: why is $`P(\text{sum }9)=4/36`$ and not 4/11?
   - Sums 2 to 12 are 11 values but not equally likely, so the naive definition does not apply to them. The 36 ordered pairs are equally likely by symmetry of fair independent dice, and 4 of them sum to 9. The step that uses the assumption is choosing the 36 pairs as the counting set.
2. Give a density that exceeds 1 somewhere and show it is still valid.
   - $`\operatorname{Uniform}(0, 0.5)`$ has density 2 on its support and integrates to 1. Validity uses non-negativity plus integral 1; no step bounds the density pointwise.
3. $`X`$ is continuous with strictly increasing CDF $`F`$. Prove $`F(X)`$ is $`\operatorname{Uniform}(0,1)`$, naming each assumption.
   - $`P(F(X) \le u)=P(X \le F^{-1}(u))`$ uses strict increase for the inverse step, then equals $`F(F^{-1}(u))=u`$ by continuity of $`F`$. The result $`u`$ on $`(0,1)`$ is the Uniform CDF.
4. A learner simulates 2000 dice pairs, gets 0.125, and claims the exact answer is wrong. What is the error?
   - Simulation noise. The standard error is $`\sqrt{(1/9)(8/9)/2000}=0.0070`$, so 0.125 sits 1.98 standard errors above 1/9, a gap about one run in 20 produces. A simulation reports an estimate with its standard error; it never refutes an exact count.

</details>

#### U2. Joint, marginal and conditional distributions, and independence

**About 3 h** · **Target:** Derive

Topics: Joint, marginal and conditional distributions; Independence and conditional independence

Conditioning is the operation behind every Bayes update, every missing-data marginalization and every independence assumption in a graphical model.

**You can now**

- Explain joint, marginal and conditional distributions and apply the chain rule to a new finite model.
- Distinguish independence, conditional independence and uncorrelatedness with a counterexample for each confusion.
- Derive a Bayes-rule conditional flip and verify it by simulation with a stated seed.

**Study**

1. [Conditional probability, Bayes rule and independence](https://www.youtube.com/watch?v=P7NE4WF8j-Q&list=PL2SOU6wwxB0uwwH80KTQ6ht66KWxbzTIo) (Harvard Stat 110 - Probability) - Lectures 4 and 5: conditional probability, Bayes rule, law of total probability and conditional independence.
2. [Joint, conditional and marginal distributions](https://www.youtube.com/watch?v=J70dP_AECzQ&list=PL2SOU6wwxB0uwwH80KTQ6ht66KWxbzTIo) (Harvard Stat 110 - Probability) - Lecture 19: joint, conditional and marginal distributions, 2-D LOTUS and the chicken-egg example.
3. [Joint, marginal and conditional drills](https://stat110.hsites.harvard.edu/sites/g/files/omnuum10111/files/stat110/files/strategic_practice_and_homework_7.pdf) (Stat 110 Strategic Practice) - Strategic Practice Q1-5: ball in sphere, uniforms, Rock-Paper-Scissors Multinomial, chicken-egg; Homework Q1-7.
4. [Chain rule and conditional independence](https://probml.github.io/book1) (Probabilistic Machine Learning: An Introduction) - Chapter 2, Sections 2.1.3.4-2.1.3.6 and 2.2.3-2.2.4 (pp. 35, 38-40): conditional probability, product and chain rules, independence and conditional independence.

**Focus**

- $`P(A \mid B)=P(A,B)/P(B)`$ restricts the sample space to $`B`$. Write the restricted space before computing.
- The chain rule factors any joint distribution. An independence claim drops a conditioning bar and must be justified, never assumed silently.
- Conditioning can reverse a comparison, as Simpson examples show. Report the conditioning set with every rate.
- Monty Hall rewards writing the host protocol as a conditional distribution, not as unconditional door odds.

**Reproduce:** Closed-book, derive $`P(\text{both boys} \mid \text{at least one boy})=1/3`$: the reduced space {BB, BG, GB} is equally likely and one outcome in three is BB. Check with NumPy in float64: numpy.random.default_rng(11), a (300000, 2) array from integers(0, 2) with 1 coding a boy; the conditional fraction is 0.33357 over 225364 conditioned pairs, with standard error 0.00099.

**Traps**

- Swapping $`P(A \mid B)`$ with $`P(B \mid A)`$. Write both conditionals with their different denominators.
- Reading pairwise independence as mutual independence. A three-coin Bernstein-style construction breaks it by hand.
- Confusing conditional with marginal independence in either direction. The chess problem in Strategic Practice 2 (Q5, given the opponent's skill level) separates the two.

**Practice**

- [Stat 110 Strategic Practice 7: Joint, Marginal and Conditional Q1-5](https://stat110.hsites.harvard.edu/sites/g/files/omnuum10111/files/stat110/files/strategic_practice_and_homework_7.pdf) - Strategic Practice Q1-5 with the inline solutions; Homework Q2-4 for extra conditional drills. Attempt each problem before reading its solution. The solutions are printed in the same file.
- [Stat 110 Strategic Practice 3: Continuing with Conditioning Q1-2](https://stat110.hsites.harvard.edu/sites/g/files/omnuum10111/files/stat110/files/strategic_practice_and_homework_3.pdf) - Strategic Practice Q1-2: Monty Hall with a biased door and conditional-independence statements. Attempt before reading the solutions printed in the same file.

**Stop when:** You derive the 1/3 and a Bayes flip without notes, your rerun of the seed-11 simulation matches 0.33357 to 3 decimals with its standard error, and you can exhibit a pairwise-but-not-mutual independence example.

<details>
<summary>Self-test</summary>

1. Derive Bayes rule from the definition of conditional probability and name the step that needs $`P(B)>0`$.
   - $`P(A \mid B)=P(A,B)/P(B)`$ and $`P(B \mid A)=P(A,B)/P(A)`$; eliminating $`P(A,B)`$ gives $`P(A \mid B)=P(B \mid A)P(A)/P(B)`$. Division needs $`P(B)>0`$, and expanding $`P(B)`$ by total probability needs a partition of the space.
2. Two fair coins. Are {first is heads} and {at least one head} independent?
   - No. $`P(\text{first H})=1/2`$ and $`P(\text{at least one H})=3/4`$, so independence needs $`P(\text{both})=3/8`$. The intersection is {first is heads} itself, {HH, HT}, with probability 1/2.
3. Give variables that are conditionally independent given $`Z`$ but marginally dependent.
   - Two symptoms given disease status: given $`Z`$ they are independent by the modeling assumption, but unconditionally they correlate through the unobserved common cause $`Z`$.
4. In Reproduce, why is the answer 1/3 and not 1/2?
   - Conditioning on at least one boy leaves {BB, BG, GB}, three equally likely outcomes. The 1/2 answer conditions on a different event, namely that a specified child is a boy.

</details>

#### U3. Expectation, variance, covariance and conditioning laws

**About 4 h** · **Target:** Derive

Topics: Expectation, variance, covariance and correlation; Total probability, expectation and variance; Conditional expectation

Mixture models, hierarchical models and unbiased estimators all rest on iterating expectations correctly. Eve's law is also the variance accounting behind every Monte Carlo error bar later.

**You can now**

- Explain expectation, variance, covariance and correlation, and why zero correlation need not imply independence.
- Derive total expectation and total variance for a new two-stage model and state every assumption used.
- Compute conditional expectations by taking out what is known and verify the result by simulation.

**Study**

1. [Linearity, indicators and symmetry](https://www.youtube.com/watch?v=LX2q356N2rU&list=PL2SOU6wwxB0uwwH80KTQ6ht66KWxbzTIo) (Harvard Stat 110 - Probability) - Lectures 9 and 10: indicator variables, linearity of expectation and the fundamental bridge.
2. [Covariance, correlation and conditional expectation](https://www.youtube.com/watch?v=IujCYxtpszU&list=PL2SOU6wwxB0uwwH80KTQ6ht66KWxbzTIo) (Harvard Stat 110 - Probability) - Lectures 21 and 25 to 27: variance of a sum, covariance, taking out what is known, Adam's law and Eve's law.
3. [Covariance and conditional-expectation drills](https://stat110.hsites.harvard.edu/sites/g/files/omnuum10111/files/stat110/files/strategic_practice_and_homework_10.pdf) (Stat 110 Strategic Practice) - Strategic Practice set 10, Conditional Expectation and Variance Q1-5: Eve's law, residual example and the spam-arrival model.
4. [Moments and the total laws](https://probml.github.io/book1) (Probabilistic Machine Learning: An Introduction) - Chapter 2, Section 2.2.5 (pp. 40-43): mean, linearity, variance, law of total expectation and law of total variance with the mixture example.

**Focus**

- Linearity of expectation needs no independence. The variance of a sum needs uncorrelatedness; independence is sufficient, not necessary.
- Eve's law splits variance into explained plus residual: $`\operatorname{Var}(Y)=\operatorname{Var}(\mathbb{E}[Y \mid X])+\mathbb{E}[\operatorname{Var}(Y \mid X)]`$. Name which term each modeling choice changes.
- Taking out what is known, $`\mathbb{E}[g(X)Y \mid X]=g(X)\mathbb{E}[Y \mid X]`$, needs $`g(X)`$ fixed given $`X`$. Conditioning on the wrong variable breaks it.
- Zero correlation with clear dependence is one construction away: take $`X \sim \operatorname{Normal}(0, 1)`$ and $`Y=X^2`$, then $`\operatorname{Cov}(X, Y)=\mathbb{E}[X^3]=0`$ by symmetry.

**Reproduce:** Closed-book, derive Eve's law on a two-stage model: with probability 1/2 roll a fair die (mean 3.5, variance 35/12) and otherwise take 10. Then $`\mathbb{E}[X]=6.75`$ and $`\operatorname{Var}(X)=35/24+(10-3.5)^2/4=12.0208`$: the first term uses LOTUS on the die branch and the second uses $`\operatorname{Var}`$ of $`\{3.5, 10\}`$. Check with NumPy in float64: numpy.random.default_rng(21), n = 400000, branch I from integers(0, 2) and then the die from integers(1, 7), with I = 0 taking the die value and I = 1 taking 10; sample mean 6.7493 and variance 12.023 with standard error of the mean 0.00548.

**Traps**

- Pushing a nonlinear function inside an expectation. $`\mathbb{E}[g(X)]`$ differs from $`g(\mathbb{E}[X])`$; Jensen fixes the direction for convex $`g`$.
- Dropping the covariance term in $`\operatorname{Var}(X+Y)`$ without checking uncorrelatedness first.
- Quoting a conditional expectation as a number. $`\mathbb{E}[Y \mid X]`$ is a function of $`X`$; only $`\mathbb{E}[Y \mid X=x]`$ is a number.

**Practice**

- [Stat 110 Strategic Practice 10: Conditional Expectation and Variance Q1-5](https://stat110.hsites.harvard.edu/sites/g/files/omnuum10111/files/stat110/files/strategic_practice_and_homework_10.pdf) - Strategic Practice Q1-5 with the inline solutions; Penultimate Homework Q1 (same file) for a random-count total with mean, variance and MGF. Attempt each problem before reading its solution. The solutions are printed in the same file.
- [Stat 110 Strategic Practice 8: Covariance and Correlation Q1-7](https://stat110.hsites.harvard.edu/sites/g/files/omnuum10111/files/stat110/files/strategic_practice_and_homework_8.pdf) - Strategic Practice Q1-7: dice sums versus differences, Poisson thinning correlation and Multinomial covariances. Attempt before reading the solutions printed in the same file.

**Stop when:** You derive Eve's law and the 12.0208 without notes, your rerun of the seed-21 simulation matches the mean to 2 decimals with its standard error, and you can construct a zero-correlation dependent pair on demand.

<details>
<summary>Self-test</summary>

1. Prove Eve's law from the definition of variance, naming where each assumption is used.
   - Write $`\operatorname{Var}(Y)=\mathbb{E}[Y^2]-\mathbb{E}[Y]^2`$, then condition: $`\mathbb{E}[Y^2]=\mathbb{E}[\mathbb{E}[Y^2 \mid X]]`$ by Adam's law, which needs $`\mathbb{E}|Y^2|`$ finite. Subtract $`\mathbb{E}[\mathbb{E}[Y \mid X]]^2`$ after writing $`\mathbb{E}[Y]=\mathbb{E}[\mathbb{E}[Y \mid X]]`$ by the same law, and regroup into $`\mathbb{E}[\operatorname{Var}(Y \mid X)]+\operatorname{Var}(\mathbb{E}[Y \mid X])`$. Both steps use iterated expectation, hence integrability.
2. $`X \sim \operatorname{Normal}(0, 1)`$ and $`Y=X^2`$. Show $`\operatorname{Cov}(X, Y)=0`$ while $`X`$ and $`Y`$ are dependent. Why is symmetry alone not enough?
   - $`\mathbb{E}[XY]=\mathbb{E}[X^3]=0`$ by symmetry and $`\mathbb{E}[X]=0`$, so $`\operatorname{Cov}=0`$. Dependence: $`P(Y>1 \mid X>1)=1`$ while $`P(Y>1)=0.3173`$. Symmetry alone fails for $`X=+1`$ or $`-1`$ with probability 1/2 each: then $`Y=1`$ is constant and independent of $`X`$.
3. In Reproduce, which part of 12.0208 comes from within-branch variation and which from between-branch variation?
   - $`35/24=1.4583`$ is $`\mathbb{E}[\operatorname{Var}(X \mid \text{branch})]`$, the within part, all of it from the die since the constant branch has zero variance. $`(10-3.5)^2/4=10.5625`$ is $`\operatorname{Var}(\mathbb{E}[X \mid \text{branch}])`$, the between part.
4. Why does the reproduce check quote 0.00548 alongside the mean?
   - It is the simulation standard error, $`\mathrm{sd}/\sqrt{n}`$. Without it the comparison of 6.7493 against 6.75 has no scale; agreement means within a few standard errors.

</details>

#### U4. Common distribution families and transformations

**About 4 h** · **Target:** Derive + Implement

Topics: Bernoulli, binomial, categorical, Gaussian, exponential and Poisson families; Transformations of random variables

Likelihoods, priors, noise models and initializations are all named distributions. Sampling them and pushing them through transforms is daily work in generative modeling and Bayesian computation.

**You can now**

- Explain the Bernoulli, Binomial, categorical, Gaussian, Exponential and Poisson families, with their means, variances and sampling stories.
- Derive a change-of-variables density with the Jacobian factor and state the support explicitly.
- Implement inverse-CDF sampling for a target density and test it against exact moments and tail probabilities.

**Study**

1. [Named discrete and continuous families](https://www.youtube.com/watch?v=TD1N4hxqMzY&list=PL2SOU6wwxB0uwwH80KTQ6ht66KWxbzTIo) (Harvard Stat 110 - Probability) - Lectures 11 to 14 and 16: Poisson, Uniform, Normal, LOTUS and Exponential memorylessness.
2. [MGFs, transformations and convolutions](https://www.youtube.com/watch?v=N8O6zd6vTZ8&list=PL2SOU6wwxB0uwwH80KTQ6ht66KWxbzTIo) (Harvard Stat 110 - Probability) - Lectures 17, 18 and 22: MGFs for Expo and Normal moments, sums of Poissons, transformations, LogNormal and convolutions.
3. [Transformation drills](https://stat110.hsites.harvard.edu/sites/g/files/omnuum10111/files/stat110/files/strategic_practice_and_homework_8.pdf) (Stat 110 Strategic Practice) - Strategic Practice set 8, Transformations Q1-3: Uniform to Beta powers, Box-Muller and the convolution derivation.
4. [Distribution families and change of variables](https://probml.github.io/book1) (Probabilistic Machine Learning: An Introduction) - Chapter 2, Sections 2.4-2.6 (pp. 49-61) for Bernoulli, categorical and Gaussian; Sections 2.8.3-2.8.5 (pp. 67-72) for bijections, the Jacobian factor and convolutions.

**Focus**

- Tie each family to a sampling story: counts of trials, waiting times, arrivals per interval. The story selects the family; the data never does by itself.
- A change of variables multiplies by the Jacobian absolute determinant and re-derives the support. A density without a support is unfinished.
- Sums of independent variables convolve densities; MGFs turn convolution into multiplication where the MGF exists near zero.
- Parametrization traps: Exponential and Gamma rate versus scale, Normal variance versus standard deviation. State yours in every signature.

**Reproduce:** Closed-book, derive by the CDF method that $`U \sim \operatorname{Uniform}(0,1)`$ gives $`X=-\log(U) \sim \operatorname{Expo}(1)`$: $`P(X \le x)=P(U \ge e^{-x})=1-e^{-x}`$ for $`x \ge 0`$, using continuity of $`U`$ for the strict-inequality step. Then check with NumPy in float64: numpy.random.default_rng(31), 300000 draws via random() then -log; sample mean 0.9983 and variance 1.0024 against exact 1 and 1, and $`P(X>2)=0.1341`$ against exact $`e^{-2}=0.1353`$ with standard error 0.00062.

**Traps**

- Dropping the Jacobian factor or keeping the old support after a transform. Both silently produce a function that does not integrate to 1.
- Assuming every distribution has an MGF. Cauchy has none; quote the MGF only with its domain.
- Confusing Poisson counts with Exponential waiting times. They describe one process from two sides; the units differ.

**Practice**

- [Stat 110 Strategic Practice 8: Transformations Q1-3](https://stat110.hsites.harvard.edu/sites/g/files/omnuum10111/files/stat110/files/strategic_practice_and_homework_8.pdf) - Strategic Practice set 8, Transformations Q1-3 with the inline solutions; Homework 8 Q4-6 for extra density derivations. Attempt each problem before reading its solution. The solutions are printed in the same file.

**Stop when:** You derive the $`-\log(U)`$ result and one non-monotone transform without notes, and your rerun of the seed-31 check matches the mean, variance and tail to 3 decimals with the stated standard error.

<details>
<summary>Self-test</summary>

1. Derive the density of $`Y=X^2`$ for $`X \sim \operatorname{Uniform}(-1, 1)`$, naming the non-monotone step.
   - $`F_Y(y)=P(-\sqrt{y} \le X \le \sqrt{y})=\sqrt{y}`$ on $`(0,1)`$, using the two-sided preimage; differentiating gives $`f_Y(y)=1/(2\sqrt{y})`$ on $`(0,1)`$. The monotone CDF rule applied to one branch alone would halve the answer.
2. Why does Box-Muller produce two independent Normals from two Uniforms?
   - The polar map $`(U_1, U_2) \to (R\cos, R\sin)`$ with $`R^2=-2\log U_1`$ has Jacobian factor that splits the joint density into a product of two standard Normal densities. Independence is read off the factored form.
3. $`X \sim \operatorname{Pois}(2)`$ counts arrivals per hour and $`T \sim \operatorname{Expo}(2)`$ is the wait for the next arrival. Are $`X`$ and $`T`$ the same object?
   - No. $`X`$ is discrete with mean 2; $`T`$ is continuous with mean 1/2 hour. Same rate parameter, different sample spaces and different questions.
4. In Reproduce, why is random() with -log enough, and what would break with integers(0, 2)?
   - Inverse-CDF needs a continuous $`\operatorname{Uniform}(0,1)`$ input so that $`P(U \ge u)=1-u`$; the proof step uses continuity. A discrete input would quantize $`X`$ and the CDF derivation would fail. random() can also return exactly 0.0 (probability $`2^{-53}`$ per draw), so library samplers use -log1p(-U) on the same input.

</details>

#### U5. Bayes rule, conjugate priors and posterior predictives

**About 4 h** · **Target:** Derive + Implement

Topics: Bayes rule, likelihood, evidence and posterior; Priors, conjugacy, posterior predictive distributions and sensitivity; Simple graphical factorization and latent variables

Posterior prediction is the honest form of a probabilistic forecast: it carries parameter uncertainty into the prediction instead of plugging in a point estimate.

**You can now**

- Explain prior, likelihood, posterior, evidence, posterior predictive and credible interval, and how each differs from its frequentist lookalike.
- Derive a Beta-Binomial conjugate posterior and its posterior predictive distribution, stating every modeling assumption.
- Factor a small joint distribution from a stated graph and run a prior-sensitivity check by repeated simulation.

**Study**

1. [Bayesian updating with discrete priors and prediction](https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class11-prep_pdf/) (MIT 18.05 - Bayesian bridge) - Class 11 reading: Bayesian Updating with Discrete Priors, with its Bayes tables; Class 12a reading: Probabilistic Prediction.
2. [Continuous priors, conjugate priors and prior choice](https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_class15-prep_pdf/) (MIT 18.05 - Bayesian bridge) - Class 13a reading: Bayesian Updating with Continuous Priors; Class 15 reading: Conjugate Priors, Beta and Normal; Class 16a and 16b readings: Choosing Priors and Probability Intervals.
3. [Hybrid Bayes rule and Beta-Binomial updating](https://www.youtube.com/watch?v=N8O6zd6vTZ8&list=PL2SOU6wwxB0uwwH80KTQ6ht66KWxbzTIo) (Harvard Stat 110 - Probability) - Lecture 17: hybrid Bayes rule and Laplace succession; Lecture 23: Beta distribution and Bayes billiards.
4. [Beta-Binomial posterior and posterior predictive](https://probml.github.io/book1) (Probabilistic Machine Learning: An Introduction) - Chapter 4, Sections 4.6.1-4.6.2.10 (pp. 129-136): conjugate priors, Beta-Binomial posterior, MAP, posterior predictive and marginal likelihood. Depth: Stop before Section 4.6.2.11 (mixtures of conjugate priors). The Dirichlet and Gaussian models and the computation methods of Section 4.6.8 belong to later stages.

**Focus**

- Conjugacy is algebra: a Beta prior times a Binomial likelihood is Beta up to a constant. The update adds successes to $`a`$ and failures to $`b`$.
- The posterior predictive averages over the posterior; the plug-in forecast conditions on one estimate. They differ most with little data.
- The evidence normalizes the posterior for fixed data and compares models across hypotheses. It never rescales a single posterior's shape.
- A graphical factorization is a chain-rule product with dropped conditioning bars. Each dropped bar is a conditional-independence claim to defend.

**Reproduce:** Closed-book, derive the Beta-Binomial update for a $`\operatorname{Beta}(2, 2)`$ prior with 7 heads in 10 flips: posterior $`\operatorname{Beta}(9, 5)`$, mean $`9/14=0.6429`$, MAP $`8/12=0.6667`$, posterior predictive $`P(\text{next head})=9/14`$. Check with NumPy in float64: numpy.random.default_rng(41), 300000 beta(9, 5) draws; posterior mean 0.6430 with standard error 0.00023, one binomial(1, theta) flip per draw from the same generator gives predictive fraction 0.6439, and the 2.5 and 97.5 percent sample quantiles give the 95 percent credible interval [0.385, 0.862] (exact $`\operatorname{Beta}(9, 5)`$ quantiles 0.386 and 0.861).

**Traps**

- Reporting the MAP as the posterior mean. For a $`\operatorname{Beta}(a, b)`$ posterior they coincide only when $`a=b`$; here 0.6667 differs from 0.6429.
- Reading a 95 percent credible interval as a 95 percent confidence interval. One conditions on the observed data with a prior; the other is a pre-data coverage statement.
- Reusing the same data to pick the prior and to update. That double counts the evidence; run a prior-sensitivity check instead.

**Practice**

- [MIT 18.05 Problem Set 7: Problems 2 and 6](https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_pset07_pdf/) - Problem 2 (Prediction: prior, posterior and posterior predictive) and Problem 6 (Normal-Normal conjugate updating); official solutions are linked beside the set with the same problem numbers. Attempt both before opening the solutions. Problem 2 is the closest match to this unit's implement target.
- [Deep-ML 336: Compute Posterior Probability using Bayes Theorem](https://www.deep-ml.com/problems/336) - Implement bayes_theorem(priors, likelihoods); the two tests check the normalized prior-times-likelihood posterior to 4 decimals. The function is a discrete Bayes table. Check it against your hand table for Problem Set 7, Problem 2(a), then contrast it with the conjugate update, which needs no table.

**Stop when:** You derive the $`\operatorname{Beta}(9, 5)`$ posterior, its mean, MAP and predictive without notes, your rerun of the seed-41 check matches the posterior mean to 3 decimals, and you can show how a stronger prior moves the predictive.

<details>
<summary>Self-test</summary>

1. Derive the $`\operatorname{Beta}(9, 5)`$ posterior from Bayes rule and name the step that uses conjugacy.
   - Posterior is proportional to $`\theta^7(1-\theta)^3`$ times $`\theta^1(1-\theta)^1=\theta^8(1-\theta)^4`$. Recognizing this kernel as $`\operatorname{Beta}(9, 5)`$ up to its normalizing constant is the conjugacy step; it uses the Beta integral identity.
2. Derive the posterior predictive 9/14 and state the assumption that lets the integral close.
   - $`P(\text{next head} \mid \text{data})`$ = integral of $`\theta`$ times $`\operatorname{Beta}(9, 5)`$ = $`\mathbb{E}[\theta]=9/14`$. The integral closes because the Bernoulli likelihood is linear in $`\theta`$ and the posterior is Beta; exchangeability of the flips justifies reusing the same $`\theta`$.
3. How does the predictive probability move if the prior changes from $`\operatorname{Beta}(2, 2)`$ to $`\operatorname{Beta}(20, 20)`$ with the same 7-in-10 data?
   - The posterior becomes $`\operatorname{Beta}(27, 23)`$ with mean $`27/50=0.54`$, pulled from 0.6429 toward the prior mean 0.5. Sensitivity shrinks as data grow: the prior contributes a fixed pseudo-count (40 here) against $`n`$ real trials.
4. A two-node graph $`X \to Y`$ claims $`p(x, y)=p(x)p(y \mid x)`$. What does the missing bar encode?
   - Nothing is dropped here: it is the chain rule. A claim appears only with more parents or missing edges, for example $`p(y \mid x, z)=p(y \mid x)`$, which asserts $`Y`$ is independent of $`Z`$ given $`X`$.

</details>

#### U6. Laws of large numbers, CLT, concentration and Monte Carlo

**About 4 h** · **Target:** Derive + Measure

Topics: Law of large numbers and central-limit behavior; Concentration bounds and what breaks under dependence or heavy tails; Monte Carlo estimation and sampling error

Every simulation check in this stage, and every bootstrap and permutation test later, stands or falls on whether the samples are independent with a finite variance and whether the error bar is quoted.

**You can now**

- Explain law-of-large-numbers behavior, central-limit approximations, and when heavy tails or dependence undermine them.
- Derive Markov, Chebyshev and Hoeffding bounds for a stated model and name the assumption each one uses.
- Build a Monte Carlo estimator with a $`1/\sqrt{n}`$ standard error and confirm the scaling by measurement.

**Study**

1. [Inequalities, LLN and CLT](https://www.youtube.com/watch?v=UtXK_EQ3Pow&list=PL2SOU6wwxB0uwwH80KTQ6ht66KWxbzTIo) (Harvard Stat 110 - Probability) - Lecture 28: Cauchy-Schwarz, Jensen, Markov and Chebyshev inequalities; Lecture 29: law of large numbers and central limit theorem.
2. [Inequality and limit-theorem drills](https://stat110.hsites.harvard.edu/sites/g/files/omnuum10111/files/stat110/files/strategic_practice_and_homework_10.pdf) (Stat 110 Strategic Practice) - Strategic Practice set 10, Inequalities Q1-4: the inequality comparison table, Jensen for $`\mathbb{E}(1/X)`$, the Chebyshev sample-size question and AM-GM.
3. [LLN, CLT and Monte Carlo drills](https://stat110.hsites.harvard.edu/sites/g/files/omnuum10111/files/stat110/files/strategic_practice_and_homework_11.pdf) (Stat 110 Strategic Practice) - Strategic Practice set 11, LLN and CLT Q1-5: convergence modes, Poisson-to-Normal, norming and the rectangle-integral Monte Carlo example.
4. [CLT and Monte Carlo approximation](https://probml.github.io/book1) (Probabilistic Machine Learning: An Introduction) - Chapter 2, Sections 2.8.6-2.8.7 (pp. 72-73): central limit behavior and the Monte Carlo approximation of a distribution.

**Focus**

- Each bound buys generality with looseness: Markov needs only non-negativity, Chebyshev adds a finite variance, Hoeffding adds bounded independent summands.
- The CLT describes the standardized mean, not the raw sum and not the underlying distribution. $`n = 30`$ is folklore, not a theorem.
- Monte Carlo error scales as $`1/\sqrt{n}`$: one more decimal digit costs 100 times the samples. Quote every estimate with its standard error.
- Dependence and heavy tails break the standard bars. An MCMC-style correlated stream or a Cauchy average needs its own analysis.

**Reproduce:** Closed-book, compute exact $`P(|Z|>2)=2(1-\Phi(2))=0.045500`$ for $`Z \sim \operatorname{Normal}(0, 1)`$ via the error function, then check three claims with NumPy in float64: numpy.random.default_rng(51), 400000 standard_normal draws give tail fraction 0.04596 with standard error 0.00033; Chebyshev allows $`P(|Z|>2) \le 1/4=0.25`$, loose but valid since $`\operatorname{Var}(Z)=1`$; Hoeffding gives $`P(|\hat{p}-p| \ge 0.05) \le 2\exp(-10)=9.08 \times 10^{-5}`$ for 2000 independent fair-coin flips.

**Traps**

- Reading a bound as an approximation. Chebyshev's 0.25 against the true 0.0455 is a guarantee, not a prediction.
- Applying Hoeffding to dependent or unbounded summands. Independence and boundedness enter the proof; dropping either voids it.
- Judging convergence from one sample size. Halve the observed standard error across a 4x sample-size run before claiming $`1/\sqrt{n}`$ scaling.

**Practice**

- [Stat 110 Strategic Practice 11: LLN and CLT Q1-5](https://stat110.hsites.harvard.edu/sites/g/files/omnuum10111/files/stat110/files/strategic_practice_and_homework_11.pdf) - Strategic Practice Q1-5 with the inline solutions; Ultimate Homework Q1 (log-scale stock price, LLN versus CLT) and Q2 (chi-square and Student-t limits) in the same file. Attempt each problem before reading its solution. The solutions are printed in the same file.
- [Stat 110 Strategic Practice 10: Inequalities Q1 and Q3](https://stat110.hsites.harvard.edu/sites/g/files/omnuum10111/files/stat110/files/strategic_practice_and_homework_10.pdf) - Strategic Practice set 10, Inequalities Q1 (comparison table) and Q3 (sample size for a 99 percent chance that the sample mean lands within 2 standard deviations). Attempt before reading the solutions printed in the same file.

**Stop when:** You derive Markov-to-Chebyshev without notes, your rerun of the seed-51 check matches 0.04596 to 4 decimals with its standard error, and you can state which bound applies to a new sampling scheme and why.

<details>
<summary>Self-test</summary>

1. Prove Chebyshev from Markov and name the step that needs a finite variance.
   - $`P(|X-\mu| \ge k\sigma)=P((X-\mu)^2 \ge k^2\sigma^2) \le \mathbb{E}[(X-\mu)^2]/(k^2\sigma^2)=1/k^2`$. Markov needs a non-negative variable, supplied by squaring; finiteness of $`\mathbb{E}[(X-\mu)^2]`$ is the variance assumption.
2. Why is Hoeffding's 9.08e-05 far below Chebyshev-style bounds for the coin example, and what does it cost?
   - Hoeffding exploits bounded independent summands to get exponential tails, while Chebyshev uses only variance for $`1/k^2`$ tails. The cost is the stronger assumption: boundedness plus full independence.
3. Averages of 100 Cauchy draws still jump around. Which assumption fails for the LLN and the CLT?
   - Finite mean for the LLN and finite variance for the CLT. Cauchy has neither, so neither theorem applies; the sample mean stays Cauchy at every n.
4. Your Monte Carlo tail estimate at $`n=400000`$ gives 0.04596 with SE 0.00033. How many draws for SE 0.0001?
   - About $`(0.00033/0.0001)^2=11`$ times more, roughly 4.4 million draws. Standard error scales as $`1/\sqrt{n}`$, so a 3.3x reduction needs an 11x sample.

</details>

#### U7. Entropy, cross-entropy, KL divergence and mutual information

**About 3 h** · **Target:** Derive

Topics: Entropy, cross-entropy, KL divergence and mutual information

Classification losses, perplexity and variational objectives are cross-entropies and KL terms in disguise. Misreading their direction or units silently flips what the optimizer rewards.

**You can now**

- Explain entropy, cross-entropy, KL divergence and mutual information in both probabilistic and coding terms.
- Derive cross-entropy as entropy plus KL divergence and identify which term changes during model fitting.
- Prove $`\mathrm{KL} \ge 0`$ and implement stable discrete entropy, cross-entropy, KL and mutual-information estimates.

**Study**

1. [Self-information, entropy and mutual information](https://d2l.ai/chapter_appendix-mathematics-for-deep-learning/information-theory.html) (D2L - Information Theory) - Sections 22.11.1-22.11.3 with the PyTorch tab: card-deck bits, entropy, joint and conditional entropy, mutual information.
2. [KL divergence and cross-entropy as a loss](https://d2l.ai/chapter_appendix-mathematics-for-deep-learning/information-theory.html) (D2L - Information Theory) - Sections 22.11.4-22.11.5 with the PyTorch tab: KL definition and properties, cross-entropy identity $`\mathrm{CE}=H+\mathrm{KL}`$, binary and multiclass loss. Depth: Run the PyTorch tab, not the MXNet or TensorFlow tab: the TensorFlow conditional-entropy and joint-entropy cells return a vector instead of a scalar, because its nansum reduces over the last axis only. Treat Section 22.11.4.3 as a symmetry demo only: sorting two sample vectors and scoring them as distributions is not a valid KL estimate.
3. [Entropy, KL non-negativity and mutual information](https://probml.github.io/book1) (Probabilistic Machine Learning: An Introduction) - Chapter 6, Sections 6.1-6.2 and 6.3.1-6.3.4 (pp. 207-220): entropy and chain rules, Theorem 6.2.1 ($`\mathrm{KL} \ge 0`$ by Jensen), KL versus maximum likelihood, mutual information identities.

**Focus**

- $`\mathrm{CE}(P, Q)=H(P)+\mathrm{KL}(P\|Q)`$. Fitting $`Q`$ moves only the KL term; $`H(P)`$ is constant for fixed data.
- KL direction matters: $`\mathrm{KL}(P\|Q)`$ punishes $`Q`$ near zero where $`P`$ is positive, even infinite for a hard zero. Averaging the wrong direction answers a different question.
- Log base sets the units: base 2 gives bits, base e gives nats, and 1 nat = 1.4427 bits. ProbML Chapter 6 and the D2L entropy helpers use base 2; the D2L cross-entropy loss and PyTorch losses use base e. Convert before comparing.
- Mutual information $`I(X;Y)=H(X)-H(X \mid Y)`$ is zero exactly under independence. Correlation only sees linear dependence; MI sees any.

**Reproduce:** Closed-book, compute in bits for $`P=(0.5, 0.25, 0.25)`$ against uniform $`Q`$ over 3 outcomes: $`H(P)=1.5`$, $`\mathrm{KL}(P\|Q)=0.0850`$, $`\mathrm{CE}(P, Q)=1.5850`$, and $`\mathrm{CE}=H+\mathrm{KL}`$ term by term. Check with NumPy in float64 using log2: $`H=1.5000`$, $`\mathrm{KL}=0.0850`$, $`\mathrm{CE}=1.5850`$, with agreement of $`\mathrm{CE}`$ and $`H+\mathrm{KL}`$ to 1e-12 in absolute value.

**Traps**

- Calling KL a distance. It is asymmetric and violates the triangle inequality: for the Reproduce pair, $`\mathrm{KL}(P\|Q)=0.0850`$ bits but $`\mathrm{KL}(Q\|P)=0.0817`$ bits.
- Taking abs() around a KL implementation, as the D2L helper does. A negative KL signals a bug (unnormalized inputs or swapped logs); abs hides it.
- Assuming differential entropy is non-negative. Continuous entropy can be negative; only the discrete form $`H \ge 0`$ holds.

**Practice**

- [D2L Information Theory Exercises 1, 2 and 4](https://d2l.ai/chapter_appendix-mathematics-for-deep-learning/information-theory.html) - Section 22.11.7: verify the card-deck entropies, prove $`\mathrm{KL} \ge 0`$ by Jensen, and derive $`I(X;Y)=H(X)-H(X \mid Y)`$. Run the PyTorch tab for the entropy helpers. Skip the TensorFlow tab per the depth note above.
- [Stat 110 Penultimate Homework Q5: surprise and entropy](https://stat110.hsites.harvard.edu/sites/g/files/omnuum10111/files/stat110/files/strategic_practice_and_homework_10.pdf) - Penultimate Homework Q5 (in the Strategic Practice 10 file): surprise function and the uniform-maximizes-entropy proof by Jensen. Attempt before reading the solution printed in the same file.

**Stop when:** You recompute the 1.5, 0.0850 and 1.5850 without notes, prove $`\mathrm{KL} \ge 0`$ naming the Jensen and support steps, and can predict which KL direction explodes for a given support mismatch.

<details>
<summary>Self-test</summary>

1. Prove $`\mathrm{KL}(P\|Q) \ge 0`$ for discrete distributions and name the step that uses each assumption.
   - $`\mathrm{KL}=\mathbb{E}_P[-\log(q/p)] \ge -\log(\mathbb{E}_P[q/p])`$ by Jensen for the convex $`-\log`$; the expectation step needs $`p`$ a valid PMF. $`\mathbb{E}_P[q/p]`$ = sum over support of $`P`$ of $`q \le 1`$, with equality iff supports match; $`-\log`$ of that is $`\ge 0`$, using $`q`$ a valid PMF. Equality needs $`q=p`$ on the support of $`P`$.
2. In Reproduce, which term changes if $`Q`$ is fitted to $`P`$, and what is its minimum?
   - Only $`\mathrm{KL}(P\|Q)`$ changes; $`H(P)=1.5`$ is fixed by the data. Its minimum is 0, attained at $`Q=P`$, where CE equals $`H(P)`$.
3. $`Q`$ assigns 0 to an outcome with $`P=0.25`$. What happens to $`\mathrm{KL}(P\|Q)`$ and to a Monte Carlo CE estimate?
   - KL is infinite: the term $`0.25\log(0.25/0)`$ diverges. A finite sample avoiding that outcome still estimates finite CE, which hides the infinite population KL. Support mismatch is a modeling error, not a sampling artifact.
4. $`X`$ and $`Y`$ are independent bits. What are $`H(X \mid Y)`$ and $`I(X;Y)`$?
   - $`H(X \mid Y)=H(X)`$ since conditioning on $`Y`$ removes nothing; $`I(X;Y)=H(X)-H(X \mid Y)=0`$. Independence zeroes mutual information in both directions.

</details>

### Mini-project: A Monte Carlo verifier for conditional probability, posterior predictives and information

**About 8 to 12 hours.** Add prob/ to numlab: exact enumeration on finite spaces, a seeded Monte Carlo estimator that reports its standard error, a Beta-Binomial posterior predictive and the discrete information measures. Solve new conditioning problems exactly, confirm them by simulation with an error-aware rule, and show where a wrong model or a heavy tail breaks the check.

1. Write an exact-enumeration helper over finite sample spaces with fractions.Fraction, and a Monte Carlo estimator that takes a seeded numpy Generator and returns the estimate, its standard error and $`n`$. A simulation check passes when the exact answer lies within four standard errors; say why four.
2. Solve two conditioning problems the units did not work: Stat 110 Homework 2 Problem 6 (two children and a girl born in March) and 18.05 Problem Set 7 Problem 1 (sober and drunk Monty). Get each exactly by enumeration, then by simulating the story, including how the information was revealed. Encode one tempting wrong answer as well, such as ignoring the March condition or treating drunk Monty like sober Monty, and show the simulation rejecting it.
3. Check the law of total variance on a two-stage model of your own, comparing the exact decomposition with a simulation of both stages.
4. Derive the Beta-Binomial posterior predictive for the number of successes in the next $`m`$ trials, naming each assumption: a Beta prior, independent trials given $`p`$, and a $`p`$ that does not change. Match scipy.stats.betabinom and a two-stage simulation that draws $`p`$ from the posterior. Then generate data whose $`p`$ drifts halfway through and show that the predictive intervals undercover on later batches.
5. Compare Chebyshev and Hoeffding bounds with simulated tail probabilities for a bounded variable. Then simulate a Pareto variable with tail index 1.5, which has a mean but no variance, and show that standard-error intervals for its mean miss far more often than they claim.
6. Implement entropy, cross-entropy and KL divergence in bits and nats with $`0\log 0=0`$ and an infinite KL when $`q`$ is zero where $`p`$ is not. Match scipy.stats.entropy, including its inf, and check $`H(p, q)=H(p)+\mathrm{KL}(p\|q)`$ and the asymmetry of KL on a pair of your own.

**Deliverables**

- numlab/prob/: enumeration, the Monte Carlo estimator, the posterior predictive and the information measures.
- The tests: exact and simulated answers for both problems with the rejected wrong answer, the total-variance check, the predictive oracle, the drift and heavy-tail failures, and the information identities.
- notes/probability.md: the derivations, each with its assumptions, and the acceptance rule for simulations.

**Checks**

- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Exact answers | Both conditioning problems are solved exactly by enumeration and match the official solutions. | The notes say which event was conditioned on in each version and why the tempting answer conditions on the wrong one. |
| Simulation discipline | Every simulation is seeded and reports n and a standard error, and acceptance uses the stated rule. | The wrong answer is rejected by the same rule that accepts the right one. |
| Posterior predictive | The Beta-Binomial predictive is derived, matches scipy.stats.betabinom and the two-stage simulation. | The drift experiment shows which assumption failed and how the predictive intervals undercover. |
| Limits and information | The bounds are compared with simulated tails, the heavy-tail failure is shown, and the information measures match SciPy with zeros handled. | The heavy-tail note explains the failure through the missing variance, not through too few samples. |

Feeds into: Capstone component 3, Monte Carlo uncertainty: the estimator with standard errors and its heavy-tail failure. The statistics section reuses the estimator for every simulation check.

### Resource route

- **Primary - Course:** [Harvard Stat 110 - Probability](https://stat110.hsites.harvard.edu/youtube) - Follow lectures 4-14, 17-23 and 25-30 with matching Strategic Practice. Use lectures 1-3 only for prerequisite repair.
- **Required - Practice:** [Stat 110 Strategic Practice](https://stat110.hsites.harvard.edu/strategic-practice-problems) - Solve the matching sets before marking a probability topic Practised; use solutions to audit reasoning, not to begin it.
- **Required - Course:** [MIT 18.05 - Bayesian bridge](https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/pages/calendar/) - Use classes 10-16 for MLE, Bayesian updating, posterior prediction, conjugacy, prior choice and credible intervals.
- **Reference - Theory:** [Probabilistic Machine Learning: An Introduction](https://probml.github.io/book1) - Consult targeted parts of Chapters 2, 3, 4 and 6 for ML notation, Monte Carlo, factorization, posterior prediction and information theory.
- **Required - Implementation:** [D2L - Information Theory](https://d2l.ai/chapter_appendix-mathematics-for-deep-learning/information-theory.html) - Use §§22.11.1-22.11.5 for runnable entropy, cross-entropy, KL and mutual-information examples and exercises.

### Exit checkpoint

Solve a new conditional-probability problem, verify it by simulation, and derive a posterior predictive calculation with its assumptions.

<details>
<summary>Deliberately left for later</summary>

- Measure-theoretic proofs
- Advanced stochastic processes
- General-purpose approximate inference

</details>

## 04. Statistics, Experimentation & Causality

**Why:** A model result matters only when the estimand, uncertainty and decision rule survive leakage, selection and alternative explanations.

### Learn this much

- [ ] Populations, samples, estimands, estimators and estimates _(Required)_
- [ ] Bias, variance, consistency and efficiency _(Required)_
- [ ] Likelihood, maximum likelihood and MAP estimation _(Required)_
- [ ] Confidence, credible and prediction intervals _(Required)_
- [ ] Hypothesis tests, errors, power and effect size _(Required)_
- [ ] Bootstrap and permutation tests _(Required)_
- [ ] Multiple comparisons, optional stopping and winner's curse _(Required)_
- [ ] Regression assumptions and diagnostics _(Required)_
- [ ] Calibration and uncertainty decomposition _(Required)_
- [ ] Missingness and selection mechanisms _(Required)_
- [ ] Randomization, units, metrics and experiment design _(Required)_
- [ ] Power and minimum detectable effect _(Required)_
- [ ] Predictive, associational and causal claims _(Required)_
- [ ] Causal graphs, confounders, colliders and mediators _(Required)_
- [ ] Interventions, adjustment and identification assumptions _(Required)_
- [ ] Heterogeneous treatment effects _(Optional)_
- [ ] Semiparametric causal estimation _(Depth)_

### Study units

#### U1. Estimands, estimators, bias, variance and consistency

**About 4 h** · **Target:** Derive

Topics: Populations, samples, estimands, estimators and estimates; Bias, variance, consistency and efficiency

Uncertainty belongs to a sampling procedure, not just to a reported number. This is the foundation for deciding whether an apparently precise model comparison is trustworthy.

**You can now**

- Distinguish a population estimand, a random estimator, its sampling distribution and the observed estimate.
- Derive the bias and mean squared error of variance estimates using $`n`$ and $`n - 1`$, and state where normality is needed.
- Prove consistency of the sample mean under finite variance and compare efficiency only within a stated estimator class.

**Study**

1. [14.310x Lecture 11: sample means and estimation](https://ocw.mit.edu/courses/14-310x-data-analysis-for-social-scientists-spring-2023/mit14_310x_s23_week05_lec11.pdf) (MIT 14.310x - Data Analysis for Social Scientists) - Slides 2 to 21, the sample mean and CLT; slides 22 to 30, statistics, parameters, estimators and estimates.
2. [14.310x Lecture 12: assessing estimators](https://ocw.mit.edu/courses/14-310x-data-analysis-for-social-scientists-spring-2023/mit14_310x_s23_week06_lec12.pdf) (MIT 14.310x - Data Analysis for Social Scientists) - Slides 2 to 25: unbiasedness, sample variance, efficiency, MSE and consistency. Depth: Stop before frameworks for finding estimators. Supply the algebra behind slide 14 rather than treating unbiased sample variance as a fact to memorize.
3. [18.05 Class 22 reading: the variance pivot](https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_class22-prep.pdf) (MIT 18.05 - Inference practice) - Section 6, Chi-square confidence intervals for the variance. Depth: Use the normal-sample chi-square pivot to obtain moments of sample variance. Leave interval construction for the intervals unit.

**Focus**

- For iid $`X_i`$ with mean $`\mu`$ and finite variance $`\sigma^2`$, expand $`\sum (X_i - \bar{X})^2 = \sum (X_i - \mu)^2 - n(\bar{X} - \mu)^2`$. Expectations give $`(n - 1)\sigma^2`$. Independence removes covariance terms in $`\operatorname{Var}(\bar{X})`$, not in $`\mathbb{E}[\bar{X}]`$.
- Under normal sampling, $`(n - 1)S^2/\sigma^2`$ is chi-square with $`n - 1`$ degrees of freedom. Its variance gives $`\operatorname{Var}(S^2) = 2\sigma^4/(n - 1)`$. Multiplying $`S^2`$ by $`(n - 1)/n`$ reduces variance but introduces bias $`-\sigma^2/n`$.
- MSE = variance + squared bias. Unbiasedness need not minimize MSE; efficiency comparisons here are between unbiased estimators at the same sample size.
- Consistency is convergence in probability. Chebyshev gives $`P(|\bar{X} - \mu| \ge \epsilon) \le \sigma^2/(n\epsilon^2)`$, which tends to zero. The CLT concerns a scaled sampling distribution, not convergence of individual observations.

**Reproduce:** Closed-book, derive the variance identity and MSE decomposition. For data [1, 2, 3], compute $`\bar{X} = 2`$, variance with $`n = 2/3`$ and with $`n - 1 = 1`$ by hand. Then use NumPy float64: rng = numpy.random.default_rng(41); draw x = rng.normal(2, 3, size=(100000, 5)) once, with samples as rows. Compute x.mean(axis=1).var(ddof=0), then v0 = x.var(axis=1, ddof=0) and v1 = x.var(axis=1, ddof=1). The sample-mean variance is 1.789 against theory 1.8. The means of v0 and v1 are 7.216 and 9.020 against 7.2 and 9.0; their variances (ddof=0) are 25.867 and 40.418 against 25.92 and 40.5. Their empirical MSEs relative to 9 are 29.050 and 40.418 against 29.16 and 40.5. Require maximum absolute error below 0.2 over these seven moment checks; this is a Monte Carlo tolerance, not a floating-point identity. Seeded values came from NumPy 2.5.4.

**Traps**

- Calling an estimate unbiased because it is close to truth in one sample. Bias is an expectation over repetitions.
- Using the normal-sample variance formula for an arbitrary distribution. Unbiasedness needs finite second moments; this variance calculation uses normality and hence finite fourth moments.
- Assuming unbiased means consistent. $`X_1`$ remains unbiased for $`\mu`$ at every $`n`$ but its variance never shrinks.

**Practice**

- The section mini-project covers this: compare bias, variance and MSE of $`n`$ versus $`n - 1`$ variance estimators across sample sizes, with an analytic normal-sampling oracle and a heavy-tailed failure case.

**Stop when:** You derive both variance estimators' bias and normal-sample MSE, pass the seven moment checks, and explain why $`X_1`$ is unbiased but not consistent.

<details>
<summary>Self-test</summary>

1. Where does the lost degree of freedom enter the sample-variance derivation?
   - Centering by $`\bar{X}`$ subtracts $`n(\bar{X} - \mu)^2`$. Its expectation is $`\sigma^2`$, using unbiasedness of $`\bar{X}`$ and $`\operatorname{Var}(\bar{X}) = \sigma^2/n`$ from iid finite-variance sampling. The expected residual sum of squares is therefore $`n\sigma^2 - \sigma^2`$.
2. For $`n = 5`$ and $`\sigma^2 = 9`$ under normal sampling, which denominator has smaller MSE?
   - Using $`n`$ gives bias -1.8, variance 25.92 and MSE 29.16. Using $`n - 1`$ gives zero bias and variance/MSE 40.5. Lower MSE here does not make the biased estimate more efficient within the lecture's unbiased class.
3. Prove the sample mean is consistent and name the assumptions at each step.
   - Common finite mean gives $`\mathbb{E}[\bar{X}] = \mu`$ by linearity. Independence makes cross covariances zero, and common finite variance gives $`\operatorname{Var}(\bar{X}) = \sigma^2/n`$. Chebyshev bounds the deviation probability by $`\sigma^2/(n\epsilon^2)`$. For fixed $`\epsilon > 0`$ and fixed $`\sigma^2`$, that bound tends to zero.

</details>

#### U2. Maximum likelihood and MAP estimation

**About 5 h** · **Target:** Derive + Implement

Topics: Likelihood, maximum likelihood and MAP estimation

Likelihood connects probability models to fitting objectives. MAP adds a prior, but a posterior mode is neither a posterior mean nor a complete uncertainty statement.

**You can now**

- Derive Bernoulli, categorical and univariate Gaussian MLEs, including boundary cases.
- Derive Bernoulli MAP with a beta prior and Gaussian-mean MAP with known observation variance and a normal prior.
- Implement the objectives and use a separate grid search to check the closed forms and prior sensitivity.

**Study**

1. [14.310x Lecture 12: likelihood as a function of parameters](https://ocw.mit.edu/courses/14-310x-data-analysis-for-social-scientists-spring-2023/mit14_310x_s23_week06_lec12.pdf) (MIT 14.310x - Data Analysis for Social Scientists) - Slides 33 to 53, maximum likelihood and the $`\operatorname{Uniform}[0, \theta]`$ example. Depth: Use strictly increasing transformations such as log to preserve a maximizer. Stop before the second uniform example and the broad MLE-properties summary.
2. [Murphy: simple likelihood and posterior derivations](https://probml.github.io/pml-book/book1.html) (Probabilistic Machine Learning: An Introduction) - April 18, 2025 online edition: Sections 4.2.3 to 4.2.5 (pp. 110 to 112), 4.5.1 (pp. 121 to 122), and 4.6.4.1 (pp. 141 to 143). Depth: Use the univariate Gaussian-Gaussian case with known observation variance. Skip multivariate covariance priors and empirical Bayes.

**Focus**

- For independent Bernoulli observations with $`k`$ successes in $`n`$ trials, $`\log L = k\log p + (n - k)\log(1 - p)`$. The interior stationary point is $`k/n`$, with negative second derivative; all-zero or all-one samples maximize at a boundary.
- Categorical MLE maximizes $`\sum N_k\log p_k`$ on the probability simplex. A Lagrange multiplier gives $`p_k = N_k/n`$; zero-count categories need boundary treatment.
- For iid Gaussian data, differentiate in $`\mu`$ and $`v = \sigma^2 > 0`$ to get $`\mu = \bar{X}`$ and $`v = \sum (X_i - \bar{X})^2/n`$. A zero residual sum of squares has no finite maximum with positive variance.
- A $`\operatorname{Beta}(a, b)`$ prior adds $`a - 1`$ and $`b - 1`$ to the log-likelihood exponents. The interior MAP formula needs both posterior shape parameters greater than one. Gaussian-mean MAP combines prior precision $`1/\tau^2`$ and data precision $`n/\sigma^2`$; that posterior is Gaussian, so its mode equals its mean, unlike the $`\operatorname{Beta}(5, 3)`$ example (2/3 versus 5/8).

**Reproduce:** From blank paper, derive the Bernoulli MLE and $`\operatorname{Beta}(a, b)`$ MAP, and complete the square for Gaussian-mean MAP. With Bernoulli data [1, 0, 1, 1] and $`\operatorname{Beta}(2, 2)`$, obtain MLE 3/4, posterior $`\operatorname{Beta}(5, 3)`$, MAP 2/3 and posterior mean 5/8. With Gaussian data [1, 2, 3], obtain joint MLE $`\mu = 2`$, $`v = 2/3`$. In a separate known-variance model with $`\sigma^2 = 1`$ and prior $`\mu \sim \mathcal{N}(0, 1)`$, obtain MAP 1.5. Check in NumPy float64 without random draws: g = numpy.linspace(0.0001, 0.9999, 9999); maximize 3*log(g) + log1p(-g), then 4*log(g) + 2*log1p(-g). Next h = numpy.linspace(-1, 4, 5001); maximize -0.5*sum((y - h)^2) over each grid value, then subtract 0.5*h^2 for MAP. Grid optima are 0.7500, 0.6667, 2.000 and 1.500. The infinity-norm difference from the four analytic optima is 3.34e-5 or less; accept below 1e-4. Widen the Gaussian prior variance and verify that its MAP approaches 2.

**Traps**

- Normalizing likelihood over parameters as though it were already a posterior. A posterior needs a prior and its normalizing integral.
- Using $`n - 1`$ in a Gaussian variance MLE. That is an unbiased estimator, not the likelihood maximizer.
- Confusing beta-prior MAP pseudo-counts $`a - 1`$, $`b - 1`$ with posterior-mean pseudo-counts $`a`$, $`b`$.

**Practice**

- [Murphy Exercises 4.1 and 4.2: Gaussian MLE and MAP](https://probml.github.io/pml-book/book1.html) - Section 4.8, p. 164 in the April 18, 2025 online edition: Exercise 4.1, MLE for the univariate Gaussian; Exercise 4.2, MAP estimation for 1D Gaussians, parts a to d. Attempt closed-book before comparing with Sections 4.2.5 and 4.6.4.1. The public solutions list only headings for these two exercises, so use the independent grid check as well. In 4.2(a), take the derivative rather than merely stating the answer; check $`n`$ growing and prior variance tending to zero or infinity.

**Stop when:** You derive the estimators without copying, pass the independent grid check, solve Exercises 4.1 and 4.2, and explain the Bernoulli and Gaussian boundary failures.

<details>
<summary>Self-test</summary>

1. Why does a stationary-point calculation fail for all-one Bernoulli data?
   - The log likelihood is $`n\log p`$ and is increasing on $`(0, 1)`$. Its maximum on $`[0, 1]`$ is $`p = 1`$. Differentiation alone misses that boundary.
2. Derive the Gaussian-mean MAP and identify the assumptions used.
   - Independence with common known $`\sigma^2`$ makes the log likelihood $`-\sum (x_i - \mu)^2/(2\sigma^2)`$ plus a constant. A normal prior adds $`-(\mu - m_0)^2/(2\tau^2)`$, with $`\tau^2 > 0`$. Setting the derivative to zero gives $`(\sum x_i/\sigma^2 + m_0/\tau^2)/(n/\sigma^2 + 1/\tau^2)`$. Positive precisions make the second derivative negative, so this is the unique mode.
3. Does a stronger prior always improve a held-out prediction?
   - No. It reduces movement away from the prior mean but can introduce bias when the prior is poorly matched. Evaluate predictions on independent data and report sensitivity; optimizing the posterior objective is not a generalization guarantee.

</details>

#### U3. Intervals, hypothesis tests, power and effect size

**About 6 h** · **Target:** Derive + Measure

Topics: Confidence, credible and prediction intervals; Hypothesis tests, errors, power and effect size

Intervals and tests are statements about a model and a procedure. Checking coverage reveals whether the procedure earns its advertised uncertainty, while effect size says what the result means in practice.

**You can now**

- Derive a normal-mean confidence interval and test from a pivot, and distinguish confidence, credible and prediction intervals.
- Explain null, alternative, statistic, p-value, Type I/II error, power and effect size without assigning a posterior probability to a p-value.
- Measure interval coverage and the null p-value distribution using repeated independent samples.

**Study**

1. [14.310x Lecture 13: reliability, intervals and tests](https://ocw.mit.edu/courses/14-310x-data-analysis-for-social-scientists-spring-2023/mit14_310x_s23_week06_lec13.pdf) (MIT 14.310x - Data Analysis for Social Scientists) - Slides 5 to 26, standard errors, confidence intervals and the chi-square and $`t`$ distributions; slides 28 to 38, the known- and unknown-variance normal-mean intervals; slides 40 to 74, hypotheses, error types, critical regions, the $`\alpha`$-$`\beta`$ trade-off and power for a simple alternative. Depth: Say 'fail to reject' rather than 'accept'. Use the normal-sample assumption for exact $`t`$ inference. Leave experiment sample-size calculations to the design unit.
2. [18.05 Class 17 reading: p-values](https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_class17-prep-b.pdf) (MIT 18.05 - Inference practice) - Section 4.3, Significance level and power; Section 7, p-values; Section 7.1, Example: z-tests. Depth: Work the normal $`z`$-test, then stop; do not turn a p-value into the probability that a hypothesis is true.
3. [18.05 Class 22 reading: pivoting and t intervals](https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_class22-prep.pdf) (MIT 18.05 - Inference practice) - Sections 3 to 5: interval statistics, z confidence intervals and t confidence intervals.
4. [Murphy: posterior intervals and future observations](https://probml.github.io/pml-book/book1.html) (Probabilistic Machine Learning: An Introduction) - April 18, 2025 online edition: Section 4.6.6, p. 146, definition (4.192) and central-interval quantiles; Section 11.7.4, pp. 406 to 407, posterior predictive and observation-noise term. Depth: Stop 4.6.6 before Monte Carlo quantile estimation and HPD regions. In 11.7.4 use the intercept-only model to separate a mean interval from a future-observation interval; do not implement Bayesian regression.

**Focus**

- For iid $`\mathcal{N}(\mu, \sigma^2)`$ data with known $`\sigma`$, $`Z = (\bar{X} - \mu)/(\sigma/\sqrt{n})`$ is standard normal. Inverting $`|Z| \le z(1 - \alpha/2)`$ gives $`\bar{X} \pm z\sigma/\sqrt{n}`$. Replacing $`\sigma`$ by $`S`$ gives an exact $`t(n - 1)`$ pivot under normal sampling; for other distributions it is only approximate.
- Coverage is $`P_\mu(\mu \in C(X))`$. A credible interval contains specified posterior mass conditional on data and prior. A prediction interval covers a new $`Y`$, so it includes observation noise as well as uncertainty about the mean.
- For a continuous exact null statistic with CDF $`F`$, $`F(T)`$ is uniform under the null. For a two-sided normal test, $`p = 2[1 - \Phi(|Z|)]`$ is also uniform. Discrete valid p-values can be conservative rather than uniform.
- Power is $`P_\delta(\text{reject})`$ for a specified alternative $`\delta`$; Type II error is its complement. Report $`\delta`$ in outcome units and a practical threshold, not only whether $`p`$ crosses $`\alpha`$.

**Reproduce:** Derive the known-$`\sigma`$ mean interval by pivoting, and derive the future-observation interval from $`\operatorname{Var}(Y_{\text{new}} - \bar{X}) = \sigma^2(1 + 1/n)`$, using independence of $`Y_{\text{new}}`$ and the sample. By hand, for $`\bar{X} = 2`$, $`\sigma = 3`$ and $`n = 25`$, the 95% mean interval is approximately [0.824, 3.176]; the prediction interval is [-3.996, 7.996]. Check in NumPy float64 with SciPy normal/t quantiles: rng = numpy.random.default_rng(43); first draw x = rng.normal(2, 3, size=(20000, 25)), then future = rng.normal(2, 3, size=20000). Use means by row, c = scipy.stats.norm.ppf(0.975), Z = (means - 2)/0.6 and p = 2*norm.sf(abs(Z)). Mean-interval coverage is 0.9503, prediction-interval coverage 0.95015, $`P(p \le 0.05)`$ is 0.0497 and $`P(p \le 0.5)`$ is 0.49905. Unknown-$`\sigma`$ $`t`$ intervals using x.std(axis=1, ddof=1)/5 and scipy.stats.t.ppf(0.975, 24) cover 0.95165. Require maximum absolute deviation below 0.01 from the five theoretical rates [0.95, 0.95, 0.05, 0.5, 0.95]. This is simulation error, not exact equality. Seeded values came from NumPy 2.5.4 with SciPy 1.18.1.

**Traps**

- Reading a 95% confidence interval as a 95% posterior probability for the fixed parameter in the realized interval.
- Using the mean interval to cover individual outcomes. Its width shrinks to zero even when outcome noise remains.
- Taking failure to reject as evidence of equivalence. A wide interval can include both zero and practically important effects.

**Practice**

- [18.05 Problem Set 10: Soda and Probabilities for hypotheses](https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_pset10_pdf/) - Problem 2(a to c), Soda, p. 1; Problem 5(a to c), Probabilities for hypotheses, pp. 2 to 3. Attempt before opening the official solutions linked on the course Problem Sets page. You may use NumPy/SciPy instead of R; distinguish interval coverage from posterior mass. In 5(b), $`\mathcal{N}(\mu, 5)`$ means standard deviation 5, as the next sentence states. The official 98% $`t`$ interval in 2(c) prints a half-width of 3.89; its endpoints [352.20, 359.80] use the correct 3.80.

**Stop when:** You derive both intervals, pass the five rate checks, solve the two named problems, and explain why neither $`p`$ nor confidence level is a posterior hypothesis probability.

<details>
<summary>Self-test</summary>

1. Show that the two-sided normal p-value is uniform under the null.
   - For $`0 < u < 1`$, $`p \le u`$ iff $`|Z| \ge \Phi^{-1}(1 - u/2)`$. Under the exact standard-normal null, symmetry gives two tails of probability $`u/2`$, hence $`P(p \le u) = u`$. The endpoints follow by continuity. Normality and a continuous null distribution are used in the tail calculation.
2. What changes if $`\sigma`$ is estimated from the same small normal sample?
   - The standardized mean uses $`S`$ and has a $`t(n - 1)`$ distribution, not a standard normal distribution. Independence of the normal sample mean and variance justifies this pivot. Using normal critical values ignores extra variance-estimation uncertainty.
3. Why does a future-observation interval not shrink to zero with n?
   - Independent future noise contributes $`\sigma^2`$ to $`\operatorname{Var}(Y_{\text{new}} - \bar{X})`$, while estimating the mean contributes $`\sigma^2/n`$. Only the second term vanishes.
4. Can a 95% Bayesian credible interval have less than 95% frequentist coverage?
   - Yes. It has 95% posterior mass under its prior and model. Repeated-sampling coverage at a fixed parameter is a different property and can be poor, especially with a mismatched strong prior.

</details>

#### U4. Bootstrap, permutation tests and multiple comparisons

**About 6 h** · **Target:** Implement + Measure

Topics: Bootstrap and permutation tests; Multiple comparisons, optional stopping and winner's curse

Repeating an analysis changes the procedure being evaluated. Resampling, metric selection and early stopping need their own null distributions and error policies, not just a familiar test call.

**You can now**

- Derive the conditional sampling variance of a bootstrap mean and explain when permutation exchangeability holds.
- Implement Bonferroni and Benjamini-Hochberg, naming FWER and FDR and the assumptions behind each guarantee.
- Measure optional-stopping inflation and explain why selecting a winning estimate exaggerates apparent effects.

**Study**

1. [18.05 Class 24 reading: the empirical bootstrap](https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_class24-prep.pdf) (MIT 18.05 - Inference practice) - Sections 4 to 7: empirical distribution, resampling, bootstrap principle, percentile and basic intervals. Depth: Derive the conditional distribution for a three-point empirical population. Do not repeat the later paired-bootstrap implementation.
2. [SciPy: the unpaired permutation null](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.permutation_test.html) (Permutation nulls and false discovery control) - Notes, Unpaired statistics (permutation_type='independent'); alternative parameter's exact and randomized p-value definitions. Depth: Read the null it states, one common distribution with labels assigned at random, and the exact-partition counting. Skip paired APIs and the numerical examples; do not reuse their randomly generated samples.
3. [SciPy: false discovery control](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.false_discovery_control.html) (Permutation nulls and false discovery control) - Notes on independence and positive regression dependence; Examples, the 15-hypothesis thrombolysis comparison of Bonferroni and Benjamini-Hochberg. Depth: Use the example to distinguish error criteria. Do not infer that FWER is the false-positive rate of one individual test.
4. [Johari, Pekelis and Walsh: why monitoring changes inference](https://arxiv.org/abs/1512.04922v3) (Always Valid Inference) - Version 3, July 16, 2019: Section 1, Introduction, pp. 1 to 3, especially Figure 1 and the continuous-monitoring motivation. Depth: Stop before the technical construction of always-valid tests. Understand the failure and the need for a predeclared fixed horizon or a valid sequential procedure.

**Focus**

- Condition on observed data: each bootstrap draw has mean $`\bar{X}`$ and variance $`\sum (x_i - \bar{X})^2/n`$. Independent draws of size $`n`$ therefore give $`\operatorname{Var}^*(\bar{X}^*) = \sum (x_i - \bar{X})^2/n^2`$. This approximates a sampling variance; it does not create new population information.
- A permutation null makes labels exchangeable, for example under identical independent group distributions or a sharp no-effect randomization null. Equal means alone do not make unequal-variance observations exchangeable.
- Bonferroni rejects at $`\alpha/m`$ and controls $`\text{FWER} = P(V \ge 1)`$ by the union bound for valid marginal p-values, without independence. BH sorts p-values, finds the largest $`k`$ with $`p(k) \le kq/m`$, and rejects ranks 1 to $`k`$. It controls $`\text{FDR} = \mathbb{E}[V/\max(R, 1)]`$ under independence or suitable positive dependence, not arbitrary dependence.
- The maximum of noisy estimates is selected for positive noise as well as signal. Its original pointwise interval is not automatically a post-selection interval. Repeated looks also select noise, even though successive cumulative tests are dependent.

**Reproduce:** By hand derive the conditional bootstrap-mean variance for data [0, 1, 2]: 2/9. Enumerate all 27 ordered length-three resamples in NumPy float64 with itertools.product(range(3), repeat=3), index the data array and take each row mean. Their mean is 1 and variance with ddof=0 is 0.222222; absolute difference from 2/9 was below 1e-15. Separately implement Bonferroni and the BH step-up rule for $`p`$ = [0.001, 0.012, 0.020, 0.080, 0.200], $`\alpha`$ = $`q`$ = 0.05. Bonferroni rejects only rank 1; BH rejects ranks 1 to 3. Compute BH adjusted values by reverse cumulative minima of $`m p(i)/i`$, capped at 1: displayed to six decimals they are [0.005, 0.030, 0.033333, 0.100, 0.200]. Compare the unrounded values with scipy.stats.false_discovery_control(p, method='bh'), requiring infinity-norm difference below 1e-12. Finally use rng = numpy.random.default_rng(44); draw rng.normal(0, 1, size=(10000, 200)) once in float64. Compute cumulative row sums at $`n = 10, 20, \ldots, 200`$ divided by $`\sqrt{n}`$; reject when abs(Z) > scipy.stats.norm.ppf(0.975). Rejection at the final look is 0.0516, versus 0.2495 for any look. Against the fixed-horizon target 0.05, allow absolute Monte Carlo error 0.01. Do not compare the any-look rate to $`1 - 0.95^{20}`$: these looks are dependent. Seeded values came from NumPy 2.5.4 with SciPy 1.18.1.

**Traps**

- Permuting labels to test only equal means when variances or sampling schemes differ. The exchangeability null is stronger.
- Treating BH as a guarantee that at most q of this particular rejection list is false. It bounds an expectation over repeated analyses.
- Reporting only the first significant look or best metric, then quoting its original fixed-analysis error rate.

**Practice**

- [18.05 Problem Set 9, Problem 2: the interrupted coin experiment](https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_pset09_pdf/) - Problem 2(a to d), p. 1: fixed flips, stopping at the third head, partial data and Bayesian likelihoods. Attempt before reading the official solutions linked on the course Problem Sets page. The section mini-project should add bootstrap coverage, Bonferroni/BH simulations and selection of the largest noisy metric; these are not checked by this coin problem.

**Stop when:** You derive and enumerate the bootstrap variance, match the BH oracle, reproduce stopping inflation, and solve the coin problem while naming the error controlled by each rule.

<details>
<summary>Self-test</summary>

1. Prove Bonferroni control and identify where independence is used.
   - Let $`I_0`$ contain the $`m_0`$ true nulls. Valid p-values give $`P(p_i \le \alpha/m) \le \alpha/m`$ for each $`i`$ in $`I_0`$. The union bound gives $`P(\text{any true null rejected}) \le \sum_{I_0} \alpha/m = m_0\alpha/m \le \alpha`$, since $`m_0 \le m`$. No independence is used. The family and thresholds must describe the full analysis, not a selected subset.
2. If all hypotheses are null, how are FDR and FWER related?
   - $`V = R`$, so $`V/\max(R, 1)`$ is 1 exactly when any hypothesis is rejected and 0 otherwise. Hence $`\text{FDR} = P(R > 0) = \text{FWER}`$. With genuine alternatives present they need not coincide.
3. Why can a percentile bootstrap fail for the endpoint of a uniform distribution?
   - Every resampled maximum is at most the observed maximum. The true upper endpoint exceeds the observed maximum almost surely in a continuous uniform sample, so a percentile interval made only from resampled maxima cannot cover it. The plug-in bootstrap fails for this boundary statistic.
4. What must a sequential alternative to fixed-horizon inference guarantee?
   - It must control the probability of a false rejection over the allowed data-dependent stopping times, not merely at each single fixed n. Looking early for safety does not license an ordinary fixed-n efficacy claim at the selected stopping time.

</details>

#### U5. Regression diagnostics, calibration and uncertainty

**About 5 h** · **Target:** Measure

Topics: Regression assumptions and diagnostics; Calibration and uncertainty decomposition

A small residual sum of squares is not an assumption check, and a low prediction loss is not a calibration certificate. This unit supplies the statistical properties that later model-evaluation tools try to estimate.

**You can now**

- Derive residual orthogonality and conditional estimator covariance, then distinguish a fitting identity from evidence for regression assumptions.
- Audit residual curvature, changing spread, dependence and influential observations without claiming that plots prove exogeneity.
- Define probability calibration and separate calibration, resolution, outcome noise and parameter uncertainty.

**Study**

1. [14.310x Lecture 18: assumptions behind regression uncertainty](https://ocw.mit.edu/courses/14-310x-data-analysis-for-social-scientists-spring-2023/mit14_310x_s23_week08_lec18.pdf) (MIT 14.310x - Data Analysis for Social Scientists) - Slides 8 to 22: full column rank, error covariance, least-squares estimator and its properties. Depth: Treat $`X`$ as fixed, or condition all error-moment assumptions on random $`X`$. Unconditional $`\mathbb{E}[\text{error}] = 0`$ alone does not establish exogeneity. Stop before $`F`$-tests.
2. [18.05 Class 26 reading: residual plots](https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/mit18_05_s22_class26-prep.pdf) (MIT 18.05 - Inference practice) - Sections 3.1 and 3.2, Residuals and Homoscedasticity, pp. 4 to 5. Depth: Use the plots, but correct p. 4's claim that heteroscedastic data must be transformed before least squares. OLS still exists; its usual homoscedastic standard errors need repair. Constant variance is an assumption about model errors, not identical variances of fitted residuals.
3. [Probability calibration, before recalibration](https://scikit-learn.org/stable/modules/calibration.html#calibration-curves) (Probability calibration: the statistical property) - Opening calibration definition, proper-scoring-rule note, and Section 1.16.1, Calibration curves. Depth: Stop before Section 1.16.2. Do not fit Platt scaling here; derive what calibration and the Brier components mean.
4. [Murphy: noise and parameter uncertainty](https://probml.github.io/pml-book/book1.html) (Probabilistic Machine Learning: An Introduction) - April 18, 2025 online edition: Section 2.1.2, Types of uncertainty, pp. 33 to 34; Section 11.7.4, Computing the posterior predictive, pp. 406 to 407. Depth: Use the two variance terms, not a new Bayesian-regression implementation. More data can reduce parameter uncertainty within a model; it need not repair model misspecification.

**Focus**

- Differentiating squared error gives $`X^\top r = 0`$ at an OLS fit. With an intercept, fitted residuals sum to zero even under a wrong model. For fixed full-rank $`X`$ and $`\mathbb{E}[\epsilon \mid X] = 0`$, OLS is unbiased; covariance is $`A\Omega A^\top`$, where $`A = (X^\top X)^{-1} X^\top`$. Only $`\Omega = \sigma^2 I`$ reduces it to $`\sigma^2(X^\top X)^{-1}`$.
- Look for curved residual means, a fan-shaped spread, serial dependence and high leverage. Fitted residual covariance is $`\sigma^2(I - H)`$ under homoscedastic independent errors, so fitted residuals are not iid. Plots can reveal failures but cannot prove causal exogeneity.
- Binary probability calibration is $`\mathbb{E}[Y \mid P] = P`$ under the evaluation population. If $`q(P) = \mathbb{E}[Y \mid P]`$ and $`\pi = \mathbb{E}[Y]`$, expected Brier loss is $`\mathbb{E}[(P - q)^2] - \operatorname{Var}(q) + \pi(1 - \pi)`$. Reliability, resolution and outcome uncertainty are distinct; binning can hide within-bin failures.
- The law of total variance separates $`\mathbb{E}[\operatorname{Var}(Y \mid \theta, D)]`$ from $`\operatorname{Var}(\mathbb{E}[Y \mid \theta, D])`$. These are conditional outcome noise and posterior parameter uncertainty within the assumed model. Sampling variability of an estimator is a repeated-data property, and misspecification is not automatically represented by either variance term.

**Reproduce:** Derive $`X^\top r = 0`$ and the Brier decomposition by adding and subtracting $`q(P)`$, conditioning on $`P`$ to cancel the cross term. Work two small cases by hand, then check in NumPy float64 without random draws. Fit $`y = x^2`$ at $`x = [-2, -1, 0, 1, 2]`$ with X = column_stack([ones(5), x]) and numpy.linalg.lstsq(X, y, rcond=None). The intercept/slope are approximately [2, 0], residuals [2, -1, -2, -1, 2], and the infinity norm of X.T @ residuals was 2.67e-15 or less; accept below 1e-12. On independent evaluation locations [-1.5, -0.5, 0.5, 1.5] with $`y = x^2`$, residuals are [0.25, -1.75, -1.75, 0.25], so orthogonality did not fix curvature. Separately freeze probability predictions [0.2]*10 + [0.8]*10, then evaluate labels [1] + [0]*9 + [1]*9 + [0]. The two group frequencies are 0.1 and 0.9. Brier loss is 0.10 = reliability 0.01 - resolution 0.16 + uncertainty 0.25. Forecasts fixed at the group frequencies give 0.09; the calibrated but uninformative forecast 0.5 gives 0.25. Require absolute error below 1e-12 for these three Brier identities. This is a constructed population check, not a recalibrator fitted and scored on the same labels.

**Traps**

- Using zero training residual mean as evidence that errors have zero conditional mean. It is forced by the fitted intercept.
- Assuming homoscedasticity or normality is required to compute OLS. They support particular efficiency or inference claims, not existence of a least-squares fit.
- Calling a lower Brier loss proof of better calibration. A gain in resolution can outweigh worse reliability.

**Practice**

- The section mini-project covers this: generate separate fitting and evaluation data with curvature, heteroscedasticity and dependence; audit residuals and interval coverage; evaluate fixed probabilistic forecasts by reliability, resolution and subgroup calibration without fitting Platt scaling.

**Stop when:** You derive residual orthogonality and the Brier decomposition, pass both deterministic checks, and explain which statistical assumptions neither a good fit nor calibration can establish.

<details>
<summary>Self-test</summary>

1. Which assumptions produce the usual OLS covariance formula?
   - Fixed full-column-rank $`X`$ defines $`A = (X^\top X)^{-1} X^\top`$. The linear model gives $`\hat{\beta} - \beta = A\epsilon`$. Conditional zero-mean errors give unbiasedness; finite error covariance gives $`\operatorname{Cov}(\hat{\beta} \mid X) = A\Omega A^\top`$. Homoscedastic uncorrelated errors make $`\Omega = \sigma^2 I`$, yielding $`\sigma^2(X^\top X)^{-1}`$. Normality is needed for the familiar exact finite-sample normal/$`t`$ inference, not this covariance algebra.
2. Can a calibrated forecast have poor discrimination?
   - Yes. A constant forecast equal to the population prevalence is calibrated but separates no cases. For this balanced toy population, $`P = 0.5`$ is calibrated and has Brier loss 0.25 versus 0.09 for the calibrated two-group forecast.
3. Derive the Brier cross-term cancellation and state its assumption.
   - Write $`P - Y = (P - q(P)) + (q(P) - Y)`$. Since $`q(P) = \mathbb{E}[Y \mid P]`$, $`\mathbb{E}[q(P) - Y \mid P] = 0`$, so the cross term vanishes after conditioning on $`P`$. Binary $`Y`$ then gives $`\mathbb{E}[\operatorname{Var}(Y \mid P)] = \mathbb{E}[q(1 - q)] = \pi(1 - \pi) - \operatorname{Var}(q)`$. Finite moments hold because $`P`$ and $`Y`$ lie in $`[0, 1]`$.
4. Why can more data shrink parameter uncertainty while uncertainty claims remain wrong?
   - Posterior concentration can occur within a misspecified model. The assumed noise law, dependence structure or evaluation population can still be wrong. Small parameter variance does not validate the model or guarantee coverage under shift.

</details>

#### U6. Missingness and selection mechanisms

**About 4 h** · **Target:** Explain

Topics: Missingness and selection mechanisms

A carefully analyzed observed sample can still answer the wrong population question. Missingness and selection determine whose outcomes enter the analysis and what assumptions are needed to recover the estimand.

**You can now**

- Define MCAR, MAR and MNAR relative to observed and missing variables, without assuming MAR is testable from incomplete data.
- Derive why complete-case means can be biased under MAR and when standardization or inverse-observation weighting identifies the population mean.
- Explain selection as conditioning on a collider and demonstrate a misleading association in a small table and a simulation.

**Study**

1. [What If: missingness as an exchangeability question](https://miguelhernan.org/s/hernanrobins_WhatIf_19aug26.pdf) (Causal Inference: What If) - August 19, 2026 edition: Section 2.2, p. 18, margin definitions of MCAR, MAR and MNAR; Sections 2.3 and 2.4, pp. 19 to 25, standardization and weighting. Depth: Translate missing counterfactuals to an observation indicator $`R`$ for a missing outcome $`Y`$ with fully observed $`X`$. Reuse the conditioning logic, not the book's treatment notation without adaptation.
2. [What If: selection and censoring](https://miguelhernan.org/s/hernanrobins_WhatIf_19aug26.pdf) (Causal Inference: What If) - Sections 8.1 to 8.3, pp. 109 to 115; Section 8.5, pp. 117 to 120, identification conditions for selection adjustment. Depth: Skip Technical Point 8.1 on hazard ratios. Keep the collider examples and exchangeability, positivity and consistency requirements; leave longitudinal censoring models for later.

**Focus**

- With $`R = 1`$ when $`Y`$ is observed and $`X`$ fully observed, MCAR means $`R`$ is independent of $`(X, Y)`$. MAR means $`R`$ is independent of $`Y`$ conditional on $`X`$. MNAR allows observation probability to depend on unobserved $`Y`$ even given $`X`$. These labels depend on what is actually observed.
- Under MAR, $`\mathbb{E}[Y \mid X, R = 1] = \mathbb{E}[Y \mid X]`$, but $`\mathbb{E}[Y \mid R = 1]`$ need not equal $`\mathbb{E}[Y]`$. Standardize conditional observed means using the population distribution of $`X`$, not the distribution among complete cases.
- If $`p(X) = P(R = 1 \mid X) > 0`$ and MAR holds, $`\mathbb{E}[RY/p(X) \mid X] = \mathbb{E}[Y \mid X]`$. Integrability and the correct observation probabilities give an unbiased Horvitz-Thompson mean; normalized weights are a different finite-sample estimator. Small probabilities can create large variance.
- Selection on a common effect can associate otherwise independent variables. Randomization before selection does not guarantee exchangeability after treatment-dependent attrition. MAR and adequate adjustment require substantive assumptions, not just a successful regression fit.

**Reproduce:** By hand let $`X \sim \operatorname{Bernoulli}(0.5)`$, $`P(Y = 1 \mid X) = 0.2 + 0.6X`$ and observation probability $`p(X) = 0.8 - 0.6X`$. Derive $`\mathbb{E}[Y] = 0.5`$ and $`\mathbb{E}[Y \mid R = 1] = 0.32`$ under MAR. If instead observation probability is $`0.8 - 0.6Y`$, the MNAR complete-case mean is 0.2. Check in NumPy float64: rng = numpy.random.default_rng(46); N = 100000; first X = (rng.random(N) < 0.5).astype(numpy.float64), next Y = (rng.random(N) < 0.2 + 0.6*X).astype(numpy.float64), then U = rng.random((3, N)). Define R0 = U[0] < 0.5, R1 = U[1] < 0.8 - 0.6*X, R2 = U[2] < 0.8 - 0.6*Y. Full, MCAR, MAR and MNAR means are 0.4983, 0.4977, 0.3171 and 0.1971. The MAR weighted mean numpy.mean(R1*Y/(0.8 - 0.6*X)) is 0.4922. Require maximum absolute deviation below 0.01 from [0.5, 0.5, 0.32, 0.2, 0.5]. Finally enumerate independent fair bits $`A`$ and $`U`$ with $`Y = U`$ and selection $`S = (A \text{ or } U)`$: among selected cases the $`A = 1`$ mean is 1/2 and the $`A = 0`$ mean is 1, despite zero causal effect. No random draw is needed for this four-row counterexample. Seeded values came from NumPy 2.5.4.

**Traps**

- Equating MAR with an unbiased complete-case marginal mean. Observed covariates can influence both missingness and outcomes.
- Claiming missingness mechanisms are identifiable just from the observed outcomes. Different unobserved-outcome laws can produce the same incomplete data.
- Fixing MNAR by weighting only on X. The assumed observation model omits dependence on missing Y, so the MAR proof no longer applies.

**Practice**

- The section mini-project covers this: compare complete-case, standardized and inverse-observation-weighted means under MCAR, MAR and MNAR; include a zero-overlap failure and a treatment-dependent selection DAG, with a stated sensitivity analysis rather than claiming MNAR is solved.

**Stop when:** You derive the two biased complete-case means, pass the five simulation checks, and identify the collider and the exact failed assumption in a new missingness scenario.

<details>
<summary>Self-test</summary>

1. Derive the MAR complete-case mean in the toy model.
   - $`P(R = 1) = 0.5 \times 0.8 + 0.5 \times 0.2 = 0.5`$. MAR makes $`Y`$ and $`R`$ conditionally independent given $`X`$, so $`\mathbb{E}[RY] = 0.5 \times 0.8 \times 0.2 + 0.5 \times 0.2 \times 0.8 = 0.16`$. Dividing by 0.5 gives 0.32, not the population mean 0.5.
2. Where are MAR and positivity used in the weighting proof?
   - Positivity makes $`1/p(X)`$ defined on every population stratum. MAR gives $`\mathbb{E}[R \mid Y, X] = p(X)`$. Therefore $`\mathbb{E}[RY/p(X) \mid X] = \mathbb{E}[Y\mathbb{E}[R \mid Y, X]/p(X) \mid X] = \mathbb{E}[Y \mid X]`$. Averaging over the population $`X`$ distribution identifies $`\mathbb{E}[Y]`$, provided the terms are integrable.
3. Why does the selected four-row table show a spurious treatment association?
   - Selection excludes $`(A, U) = (0, 0)`$. Among selected $`A = 0`$ cases, $`U`$ must be 1; among selected $`A = 1`$ cases, $`U`$ remains equally likely 0 or 1. The path $`A \to S \leftarrow U \to Y`$ opens when conditioning on $`S`$. Changing $`A`$ does not change $`Y = U`$, so the causal effect is still zero.

</details>

#### U7. Randomized experiment design, power and MDE

**About 5 h** · **Target:** Derive + Measure

Topics: Randomization, units, metrics and experiment design; Power and minimum detectable effect

The design determines which uncertainty calculation is valid. Sample size follows from the effect worth detecting and the independent units available, not from how many telemetry rows can be collected.

**You can now**

- Specify an estimand, randomization unit, analysis unit, primary metric, guardrails, practical threshold and stopping/multiplicity policy before an experiment.
- Derive normal-approximation power, sample size and minimum detectable effect for two independent equal-variance arms.
- Audit clustering, interference, attrition, sample-ratio mismatch and post-treatment segment selection before interpreting an effect.

**Study**

1. [14.310x Lecture 15: randomized comparisons](https://ocw.mit.edu/courses/14-310x-data-analysis-for-social-scientists-spring-2023/mit14_310x_s23_week07_lec15.pdf) (MIT 14.310x - Data Analysis for Social Scientists) - Slides 2 to 8: average treatment effects, difference in means, variance, intervals and testing. Depth: Separate finite-population randomization variance from the independent-superpopulation normal model used in this card's power check. Stop before the Oregon example.
2. [14.310x Lecture 13: power calculations](https://ocw.mit.edu/courses/14-310x-data-analysis-for-social-scientists-spring-2023/mit14_310x_s23_week06_lec13.pdf) (MIT 14.310x - Data Analysis for Social Scientists) - Slides 75 to 83: power inputs, normal approximation, stratification and clustering. Depth: Retain both rejection tails when checking power. The sample-size shortcut drops a small tail and is an approximation, not an exact equality.
3. [14.310x Lecture 22: units and spillovers](https://ocw.mit.edu/courses/14-310x-data-analysis-for-social-scientists-spring-2023/mit14_310x_s23_week10_lec22.pdf) (MIT 14.310x - Data Analysis for Social Scientists) - Slides 2 to 4, interventions, units and stratification; slides 10 to 17, spillovers and two-step randomization. Depth: Use the labor-market example to explain interference. Skip the detailed outcome tables and the later rice-program case.
4. [Trustworthy experimentation during the experiment](https://www.microsoft.com/en-us/research/group/experimentation-platform-exp/articles/patterns-of-trustworthy-experimentation-during-experiment-stage/) (Patterns of trustworthy experimentation) - Capture Unexpected Effects Early with a Complete Metric Set, including the taxonomy table; Measure Early and Often; Set Up Alerts to Detect Unintended Degradations; Use Segments that are Stable during the A/B Test; Segment by Date. Depth: Use the operational checklist, not its word 'guarantees' for segment validity. Stable segments and no detected sample-ratio mismatch do not prove exchangeability, prevent false alarms or establish correct uncertainty. Separate safety monitoring from fixed-horizon efficacy inference.

**Focus**

- Specify assignment and analysis units before choosing a standard error. Difference in means estimates an intention-to-treat effect of assignment when outcomes are observed without selection. Treatment receipt and post-treatment activity are different estimands.
- For independent arms with $`n`$ observations each and known common variance $`\sigma^2`$, $`D = \text{mean}(T) - \text{mean}(C)`$ has variance $`2\sigma^2/n`$. With $`\lambda = \delta/\text{SE}`$ and $`c = z(1 - \alpha/2)`$, two-sided power is $`1 - \Phi(c - \lambda) + \Phi(-c - \lambda)`$.
- For positive $`\delta`$ and a negligible lower tail, $`n`$ per arm is approximately $`2\sigma^2[z(1 - \alpha/2) + z(1 - \beta)]^2/\delta^2`$. MDE reverses this equation. Distinguish per-arm $`n`$ from total $`2n`$ and absolute outcome change from relative percentage change.
- Predeclare one primary metric and how guardrail decisions and multiple metrics will be handled. Test observed assignment counts against the configured allocation, not an assumed 50/50 split. Investigate SRM rather than treating balanced counts as proof that logging is unbiased.

**Reproduce:** Derive the difference-of-means variance by adding independent arm variances, then derive the two-tail power expression and the approximate per-arm sample size. By hand set $`\alpha = 0.05`$, target power = 0.8, $`\sigma = 1`$ and $`\delta = 0.2`$: the shortcut rounds up to $`n = 393`$ per arm, total 786. Use NumPy float64 and scipy.stats.norm to compute c = norm.ppf(0.975), SE = sqrt(2/393), approximate MDE = (c + norm.ppf(0.8))*SE, and exact normal-model two-sided power = norm.sf(c - delta/SE) + norm.cdf(-c - delta/SE). Rounded values are SE 0.07134, MDE 0.1999 and power 0.8006. Check by sampling sufficient statistics, not individual rows: rng = numpy.random.default_rng(47); first control = rng.normal(0, 1/sqrt(393), size=20000), then treatment = rng.normal(0.2, 1/sqrt(393), size=20000). Reject when abs((treatment - control)/SE) > c. Power is 0.7988; its absolute difference from exact power is 0.0018 or less, with a Monte Carlo acceptance tolerance of 0.01. Explain why the same calculation does not apply to 393 observations that come from only a few independent clusters. Seeded values came from NumPy 2.5.4 with SciPy 1.18.1.

**Traps**

- Counting repeated events from the same randomized user as independent participants. More rows need not add independent information.
- Using a significant pilot's selected effect as the unquestioned power input. Winner's curse can make the planned experiment too small.
- Choosing a favorable metric, duration or active-user subgroup after seeing results. Those choices change the estimand and the error policy.

**Practice**

- [18.05 Problem Set 8, Problem 3: radar-gun threshold and power](https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/resources/mit18_05_s22_pset08_pdf/) - Problem 3(a), 3(b)(i to ii) and 3(c), z-test, p. 2: null, threshold, power at 45 mph and number of cameras. Attempt before reading the official solutions linked on the course Problem Sets page. This is a one-sided test, unlike the reproduce check. The section mini-project should add a pre-analysis plan, assignment-unit audit, SRM and guardrail decision rules.

**Stop when:** You derive power and per-arm sample size, pass the Monte Carlo check, solve the radar-gun problem, and can explain why clustered rows or post-treatment segments invalidate a naive experiment analysis.

<details>
<summary>Self-test</summary>

1. Why does halving the target effect require about four times as many observations?
   - With $`\alpha`$, target power and variance fixed, the normal-approximation sample size is proportional to $`1/\delta^2`$. Replacing $`\delta`$ by $`\delta/2`$ multiplies $`n`$ by four. This assumes the same independent sampling units and variance model.
2. Prove equal allocation minimizes variance when total N and common arm variance are fixed.
   - For independent arms, $`\operatorname{Var}(D) = \sigma^2(1/n_T + 1/n_C) = \sigma^2 N/(n_T n_C)`$, with $`n_T + n_C = N`$. The nonnegative square $`(n_T - n_C)^2`$ gives $`n_T n_C \le N^2/4`$, so variance is at least $`4\sigma^2/N`$. Equality occurs at equal allocation. Common variance and equal per-unit costs are the conditions for this design comparison.
3. Can passing SRM and finding stable pre-treatment segments establish a causal effect?
   - No. They remove some warning signs but do not rule out outcome-dependent logging, interference, selection or measurement errors. Valid assignment and observation, a well-defined intervention and correct inference still matter. Multiplicity can also create false segment discoveries.
4. What is wrong with deciding from $`p`$ alone even in a valid experiment?
   - A tiny effect can be statistically significant in a large sample, and an important effect can be imprecisely estimated in a small sample. Compare the effect and interval with the predeclared practical threshold, guardrails, costs and risks.

</details>

#### U8. Causal claims, causal graphs, adjustment and identification

**About 6 h** · **Target:** Explain + Derive

Topics: Predictive, associational and causal claims; Causal graphs, confounders, colliders and mediators; Interventions, adjustment and identification assumptions; Heterogeneous treatment effects

Prediction describes observations; causal identification asks what would happen under an intervention. A precise association cannot replace the assumptions that connect those two questions.

**You can now**

- Distinguish predictive, associational and causal claims by stating the intervention and potential-outcome estimand.
- Draw a DAG, recognize confounders, colliders and mediators, and use the backdoor criterion to select or reject an adjustment set.
- Derive the adjustment formula using consistency, conditional exchangeability and positivity, and check a confounded example by hand and in NumPy.
- For the optional extension, distinguish subgroup average treatment effects from individual effects and prognostic differences.

**Study**

1. [14.310x Lecture 14: potential outcomes and assignment](https://ocw.mit.edu/courses/14-310x-data-analysis-for-social-scientists-spring-2023/mit14_310x_s23_week07_lec14.pdf) (MIT 14.310x - Data Analysis for Social Scientists) - Slides 1 to 14: causal statements, predictive questions, potential outcomes, SUTVA, assignment and the selection problem.
2. [What If: define and identify the effect](https://miguelhernan.org/s/hernanrobins_WhatIf_19aug26.pdf) (Causal Inference: What If) - August 19, 2026 edition: Sections 1.1 and 1.2 (pp. 3 to 6), Section 1.5 (pp. 9 to 11), Section 2.3 (pp. 19 to 20), and Section 3.1 (pp. 27 to 29). Depth: Keep individual versus average effects, consistency, exchangeability, positivity and standardization. Skip alternative effect scales and the chapter's longer historical discussion.
3. [What If: paths, confounding and valid adjustment](https://miguelhernan.org/s/hernanrobins_WhatIf_19aug26.pdf) (Causal Inference: What If) - Sections 6.1 to 6.3 (pp. 75 to 81), Section 7.3 (pp. 95 to 98), and Section 8.1 (pp. 109 to 110). Depth: Work the chain, fork and collider rules and the backdoor criterion. Skip Technical Points 6.2 and 6.3 on structural models and cross-world independence, and Fine Point 6.2 on faithfulness. Do not proceed to SWIGs, longitudinal treatment or semiparametric estimation.
4. [Optional: heterogeneous average effects](https://miguelhernan.org/s/hernanrobins_WhatIf_19aug26.pdf) (Causal Inference: What If) - Sections 4.1 and 4.2, pp. 47 to 51, heterogeneity and stratification to identify effect modification. Depth: Optional topic only. Compare identified effects within pre-treatment strata; stop before transportability and matching. Do not build a treatment-effect learner here.

**Focus**

- For a well-defined treatment $`A`$, potential outcomes $`Y(1)`$ and $`Y(0)`$ define $`\text{ATE} = \mathbb{E}[Y(1) - Y(0)]`$. Consistency relates observed $`Y`$ to $`Y(A)`$. No interference is needed for this simple unit-level treatment notation; otherwise others' assignments must enter the potential outcomes.
- A predictive target uses observed information; an associational contrast conditions on $`A`$; an intervention sets $`A`$ and removes its incoming causal arrows. A DAG records substantive causal assumptions, including omitted common causes, not just observed correlations.
- A backdoor adjustment set contains no descendants of $`A`$ and blocks every path from $`A`$ to $`Y`$ that starts with an arrow into $`A`$. Conditioning blocks noncollider paths but can open a collider or a collider's descendant. For the total effect, conditioning on a mediator generally removes part of the effect rather than repairing confounding.
- Under consistency, $`Y(a)`$ independent of $`A`$ given $`L`$, and $`P(A = a \mid L) > 0`$ on the target population's support, $`\mathbb{E}[Y(a)] = \sum_l \mathbb{E}[Y \mid A = a, L = l] P(L = l)`$. Graphical blocking supports exchangeability only if the assumed causal graph is appropriate. Optional subgroup effects also require adequate adjustment and overlap within the subgroup.

**Reproduce:** Derive the adjustment formula line by line, naming where exchangeability, positivity and consistency enter. Work a four-cell population: $`L`$ is a fair bit; $`P(A = 1 \mid L = 0) = 0.2`$ and $`P(A = 1 \mid L = 1) = 0.8`$; $`Y = 2A + L`$, with potential outcomes $`Y(0) = L`$ and $`Y(1) = 2 + L`$. Draw $`L \to A`$, $`L \to Y`$, $`A \to Y`$. The observed means are 0.2 for $`A = 0`$ and 2.8 for $`A = 1`$, giving an associational difference 2.6; intervention means are 0.5 and 2.5, giving $`\text{ATE}`$ 2. Check in NumPy float64 without random draws: P = numpy.array([[0.4, 0.1], [0.1, 0.4]], dtype=numpy.float64), rows L = 0, 1 and columns A = 0, 1; Y = numpy.array([[0, 2], [1, 3]], dtype=numpy.float64). Compute observed = (P*Y).sum(axis=0)/P.sum(axis=0) and intervention = P.sum(axis=1) @ Y. Compare with [0.2, 2.8] and [0.5, 2.5]; require maximum absolute error below 1e-12. These are population identities, not fitted in-sample scores. Explain why adjusting for $`L`$ closes the backdoor path, while making $`A`$ deterministic given $`L`$ would destroy the observational overlap needed for this formula.

**Traps**

- Adjusting for every measured predictor. A collider or post-treatment variable can introduce bias or change the effect being estimated.
- Thinking a randomized assignment fixes interference or treatment-dependent missing outcomes. Randomization addresses baseline assignment confounding, not every validity failure.
- Calling a subgroup with high untreated outcomes a subgroup with large treatment benefit. Prognosis and the contrast $`Y(1) - Y(0)`$ are different quantities.

**Practice**

- The section mini-project covers this: define a potential-outcome estimand, draw a confounding/selection DAG, compare observed and intervention means under a known generator, and demonstrate one invalid adjustment and one overlap failure. Optional: report pre-treatment subgroup average effects without claiming individual-effect identification.

**Stop when:** You reconstruct the adjustment proof, pass the four-cell NumPy check, and select or reject adjustment sets in a new fork, mediator and collider graph while naming untestable assumptions. The heterogeneous-effects extension is optional.

<details>
<summary>Self-test</summary>

1. Prove the adjustment formula and name the role of each assumption.
   - For integrable potential outcomes, total expectation gives $`\mathbb{E}[Y(a)] = \sum_l \mathbb{E}[Y(a) \mid L = l] P(L = l)`$. Conditional exchangeability replaces the inner mean by $`\mathbb{E}[Y(a) \mid A = a, L = l]`$. Positivity ensures that observed treatment stratum exists for each $`l`$ with positive target mass. Consistency replaces $`Y(a)`$ with observed $`Y`$ within $`A = a`$. This gives the adjustment formula. The simple $`Y(a)`$ notation presumes a well-defined intervention and no interference.
2. In $`L \to A`$, $`L \to Y`$, $`A \to M \to Y`$, should you adjust for $`L`$ or $`M`$ to estimate the total effect of $`A`$?
   - Adjusting for $`L`$ blocks the backdoor fork $`A \leftarrow L \to Y`$. $`M`$ is a descendant of $`A`$ on the causal pathway, so it is not an ordinary backdoor adjustment variable for the total effect. Conditioning on $`M`$ changes the contrast and does not by itself identify a direct effect.
3. Why can conditioning on $`C`$ in $`A \to C \leftarrow U \to Y`$ create bias even if $`A`$ was randomized?
   - The $`A`$-to-$`Y`$ path through $`C`$ is blocked marginally because $`C`$ is a collider. Conditioning on $`C`$ opens it and associates $`A`$ with $`U`$ within $`C`$ strata, so randomization's marginal exchangeability need not survive. Adjustment for predictive variables is not automatically safe.
4. What fails if $`A = L`$ in the four-cell model, even when you know the DAG?
   - $`P(A = 1 \mid L = 0)`$ and $`P(A = 0 \mid L = 1)`$ are zero. The missing treatment-stratum means cannot be recovered by standardization from observed data alone. The structural equation could supply extrapolation, but then identification depends on that additional modeling knowledge, not the observed backdoor adjustment formula.
5. Optional: does identifying $`\mathbb{E}[Y(1) - Y(0) \mid L]`$ identify each individual's treatment effect?
   - No. It identifies a subgroup average under the relevant assumptions, not the joint pair of potential outcomes for an individual. Usually only one potential outcome is observed per individual. Different individual-effect distributions can share the same identifiable subgroup means.

</details>

### Mini-project: A statistical audit harness and the memo for a flattering experiment

**About 14 to 18 hours.** Add stats/ to numlab: a simulation harness with a known truth that tests estimators, intervals, multiplicity, regression assumptions, calibration, missingness and causal adjustment, each against an oracle and each with a failure case. Then audit an experiment that looks too good, rerun it under a plan written first, and write the decision memo.

1. Build the harness on the Monte Carlo estimator from the probability section: each check names its known truth, runs seeded repetitions and reports a Monte Carlo standard error. Compare the $`n`$ and $`n - 1`$ variance estimators for $`n`$ = 2, 5, 10 and 50 under normal sampling against the analytic bias, variance and MSE. Repeat under a $`t`$ distribution with 3 degrees of freedom, which has variance 3 but no fourth moment, and show the normal-theory variance formula failing.
2. Measure percentile-bootstrap coverage for an exponential mean at $`n = 10`$ and $`n = 100`$; expect clear undercoverage at $`n = 10`$. Simulate $`m`$ hypotheses with $`m_0`$ true nulls and compare the realized FWER and FDR of Bonferroni and Benjamini-Hochberg. Then report the largest of $`k`$ noisy metric estimates whose true effects are equal, and measure the bias and the coverage of its naive interval.
3. Generate separate fitting and evaluation data with a curved mean, variance growing with $`x`$ and serially dependent errors. Show the residual diagnostics, compare the usual OLS standard error and your own sandwich estimator with the sampling standard deviation from repetitions, and measure prediction-interval coverage on the evaluation data. Score fixed probability forecasts by the Brier decomposition into reliability, resolution and uncertainty, and by calibration within subgroups, without fitting Platt scaling.
4. Compare complete-case, standardized and inverse-observation-weighted means under MCAR, MAR and MNAR. Add a stratum whose observation probability is zero and show the weighting break, draw a DAG in which selection depends on treatment, and for MNAR report a sensitivity range over an assumed shift in the missing outcomes instead of a single corrected number.
5. Define one causal question in the generator as a potential-outcome estimand and draw its DAG with a confounder and a selection node. Show observed and interventional means differing, adjustment for a valid backdoor set recovering the effect, adjustment for a collider or mediator failing, and an overlap failure. Optionally report pre-treatment subgroup effects without claiming individual effects.
6. Construct the flattering experiment: a configured 50/50 test analyzed on event rows rather than users, checked daily and stopped at the first $`p`$ below 0.05, reported on the best of ten metrics and on a post-treatment active-user segment, with a sample-ratio mismatch. Write the pre-analysis plan before touching it: estimand, randomization and analysis units, one primary metric, guardrails, a practical threshold, $`\alpha`$, the stopping rule and the multiplicity policy. Then list every validity failure with the check that exposes it, including a chi-square test of the assignment counts against the configured split.
7. Rerun the experiment under the plan: compute the per-arm sample size with both rejection tails, randomize and analyze users, run to the fixed horizon and report the effect and interval against the practical threshold and the guardrails. Write a one-page decision memo that says ship, do not ship or extend, and why.

**Deliverables**

- numlab/stats/: the harness and every check, each with its oracle and its failure case.
- The audit: the pre-analysis plan, the list of validity failures with their checks, the rerun and its output.
- The decision memo, the two DAGs and notes/statistics.md with the derivations behind each check.

**Checks**

- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Estimators and intervals | The variance-estimator table matches the normal-theory oracle, the $`t_3`$ failure is shown, and bootstrap coverage is measured at both sample sizes. | Each Monte Carlo result reports its standard error, and the notes say which assumption each failure breaks. |
| Multiplicity and selection | Realized FWER and FDR match what each procedure controls, and the winner's-curse bias is measured. | The notes distinguish the two error rates and explain why the selected estimate needs its own interval. |
| Regression and calibration | Diagnostics, the sandwich comparison, prediction-interval coverage and the Brier decomposition are all on separate evaluation data. | Subgroup calibration finds a failure that the overall reliability term hides. |
| Missingness and causality | Each missingness mechanism, the zero-overlap failure, valid and invalid adjustment and the overlap failure are shown against the known truth. | The MNAR result is a sensitivity range, and every causal claim names its untestable assumption. |
| Experiment audit and memo | The plan predates the analysis, every validity failure has a check, and the rerun reports the effect against the practical threshold. | The memo makes a decision a reader could act on, with the guardrails and the residual risks stated. |

Feeds into: Capstone component 4, experiment analysis: the harness, the audit with its failures and the decision memo.

### Resource route

- **Primary - Course:** [MIT 14.310x - Data Analysis for Social Scientists](https://ocw.mit.edu/courses/14-310x-data-analysis-for-social-scientists-spring-2023/pages/calendar/) - Follow lectures 11-15, 17-20 and 22 with matching slides and problem sets for inference, regression, causality and experiment design.
- **Required - Practice:** [MIT 18.05 - Inference practice](https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/pages/calendar/) - Use classes 17-20, 22-24 and 26 with their problem sets for tests, intervals, bootstrap and regression.
- **Required - Theory:** [Causal Inference: What If](https://miguelhernan.org/whatifbook) - Read Chapters 1-3 and 6-8 for causal effects, DAGs, confounding, selection bias and identification reasoning.
- **Required - Application:** [Patterns of trustworthy experimentation](https://www.microsoft.com/en-us/research/group/experimentation-platform-exp/articles/patterns-of-trustworthy-experimentation-during-experiment-stage/) - Read after the course to connect health checks, guardrails and statistical interpretation to production launch decisions.
- **Depth - Depth:** [Always Valid Inference](https://arxiv.org/abs/1512.04922) - Use the introduction and worked motivation to understand optional-stopping failure. Reproducing the theory is outside this gate.
- **Reference - Theory:** [Probabilistic Machine Learning: An Introduction](https://probml.github.io/pml-book/book1.html) - Use the April 18, 2025 online edition: Sections 4.2.3 to 4.2.5, 4.5.1 and 4.6.4.1 for Bernoulli and Gaussian MLE/MAP; the definition and central intervals in 4.6.6; 2.1.2 and 11.7.4 for predictive uncertainty. Exercises 4.1 and 4.2 supply derivation practice.
- **Reference - Reference:** [Permutation nulls and false discovery control](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.false_discovery_control.html) - Read permutation_test Notes, Unpaired statistics, for exchangeability and exact partitions; false_discovery_control Notes and the named thrombolysis example for Bonferroni and Benjamini-Hochberg. Use as an independent implementation oracle, not as a substitute for stating assumptions.
- **Reference - Reference:** [Probability calibration: the statistical property](https://scikit-learn.org/stable/modules/calibration.html#calibration-curves) - Read the opening calibration definition, the proper-scoring-rule note, and Section 1.16.1, Calibration curves. Stop before recalibration methods; the later Classical ML unit implements them.

### Exit checkpoint

Audit a flattering experiment, identify its validity failures, and produce a defensible rerun and decision memo.

<details>
<summary>Deliberately left for later</summary>

- Advanced semiparametric efficiency theory
- Longitudinal causal inference
- Specialized survey methodology

</details>

## 05. Optimization & Numerical Methods

**Why:** Training behavior is controlled by objective geometry, stochastic noise, finite precision and the state carried by the optimizer.

### Learn this much

- [ ] Convex sets, convex functions and geometric intuition _(Required)_
- [ ] First- and second-order optimality conditions _(Required)_
- [ ] Smoothness, strong convexity and conditioning _(Required)_
- [ ] Gradient descent on quadratic and general objectives _(Required)_
- [ ] Stochastic gradients, minibatches and noise _(Required)_
- [ ] Momentum and acceleration intuition _(Required)_
- [ ] Adaptive optimizers, bias correction and weight decay _(Required)_
- [ ] Learning-rate schedules, clipping and stopping _(Required)_
- [ ] Constrained optimization, Lagrangians and KKT conditions _(Required)_
- [ ] Regularization and proximal intuition _(Required)_
- [ ] Floating-point representation, rounding and machine precision _(Required)_
- [ ] Overflow, underflow and catastrophic cancellation _(Required)_
- [ ] Stable softmax, log-sum-exp and online reductions _(Required)_
- [ ] Residuals, tolerances and iterative-solver error _(Required)_
- [ ] Mixed precision and accumulation choices _(Required)_
- [ ] Newton and quasi-Newton methods _(Optional)_
- [ ] Convex duality beyond KKT interpretation _(Depth)_

### Study units

#### U1. Convexity, optimality conditions and conditioning

**About 5 h** · **Target:** Derive

Topics: Convex sets, convex functions and geometric intuition; First- and second-order optimality conditions; Smoothness, strong convexity and conditioning

An optimizer's behavior starts with the objective's geometry. These conditions tell you which local evidence certifies a global solution and which does not.

**You can now**

- Prove the first- and second-order characterizations of a differentiable convex function on an open convex domain.
- Distinguish stationary points, local minima and global minima, including degenerate Hessians.
- Read smoothness, strong convexity and conditioning from a quadratic's eigenvalues.

**Study**

1. [EE364a: convex sets and convex functions](https://see.stanford.edu/materials/lsocoee364a/02ConvexSets.pdf) (Stanford EE364a - Convex Optimization) - Lecture 2 notes: Convex set (slide 2-3), Convex combination and convex hull (2-4), Hyperplanes and halfspaces (2-6), and Intersection (2-12). Depth: Read these headings only. Use the book below for the proofs; leave separation and generalized inequalities aside.
2. [EE364a: derivative tests for convexity](https://see.stanford.edu/materials/lsocoee364a/03ConvexFunctions.pdf) (Stanford EE364a - Convex Optimization) - Lectures 3 and 4 notes: First-order condition (slide 3-7), Second-order conditions (3-8), and Examples (3-9): quadratic and least-squares functions.
3. [Convexity proofs and curvature bounds](https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf) (Convex Optimization) - Sections 2.1.4 (pp. 23 to 25), 3.1.1 to 3.1.4 (pp. 67 to 71), 4.2.3 through Unconstrained problems (pp. 139 to 141), and 9.1.2 (pp. 459 to 463). Depth: Prove the derivative tests using restrictions to lines. In 9.1.2 focus on the lower and upper quadratic models and the ratio $`M/m`$, not the width calculation.

**Focus**

- A convex set contains every segment between its points. A convex function has a convex domain and lies below each chord; its tangent planes lie below its graph.
- For $`C^2`$ functions on an open convex domain, a PSD Hessian everywhere characterizes convexity. At one stationary point, a PSD Hessian is only a necessary local-minimum condition; a PD Hessian is sufficient.
- For $`f(x)=x^\top Qx/2`$ with symmetric positive definite $`Q`$, $`\mu=\lambda_{\min}(Q)`$, $`L=\lambda_{\max}(Q)`$, and $`\kappa=L/\mu`$. The gradient is $`L`$-Lipschitz and the lower quadratic model uses $`\mu/2`$.

**Reproduce:** Closed-book, prove the first-order inequality in both directions, then prove the Hessian test by restricting to a segment. By hand use $`Q=\operatorname{diag}(1,9)`$: find $`\operatorname{grad} f`$, $`\mu=1`$, $`L=9`$, $`\kappa=9`$ and $`f(1,1)=5`$. Check with NumPy float64 arrays, np.linalg.eigvalsh(Q) and np.linalg.cond(Q); scalar absolute differences from [1,9], 9 and 5 must be below 1e-12. No random draws are needed.

**Traps**

- Dropping the convex-domain assumption: $`1/x^2`$ has positive second derivative on its disconnected domain, but that domain is not convex.
- Calling every stationary point a minimum: $`x^2-y^2`$ has a saddle at the origin.
- Equating strict and strong convexity: $`x^4`$ is strictly convex on $`\mathbb{R}`$ but has no positive global lower curvature bound.

**Practice**

- [Convex Optimization: Exercise 3.8, Second-order condition for convexity](https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf) - Exercise 3.8, printed p. 114. Attempt both directions before looking back at the first-order proof on p. 70. Give the disconnected-domain counterexample as well.

**Stop when:** You can prove both derivative tests with their domain assumptions, classify the three stationary-point counterexamples, and recover the quadratic's curvature bounds without notes.

<details>
<summary>Self-test</summary>

1. Where are the assumptions used in the first-order proof?
   - Convexity of the domain keeps $`x+t(y-x)`$ inside it. Convexity of $`f`$ supplies the chord inequality; divide by positive $`t`$ and use differentiability as $`t`$ tends to zero. Conversely, apply the tangent inequality at $`z=\theta x+(1-\theta)y`$ to $`x`$ and $`y`$. Nonnegative weights preserve inequalities and cancel the derivative terms; domain convexity ensures $`z`$ exists. At $`\theta=0`$ or $`1`$ the chord statement is equality.
2. Why does a zero gradient certify a global minimum only in the convex case?
   - The convex tangent lower bound becomes $`f(y)\ge f(x)`$ for every feasible $`y`$. Without convexity that lower bound need not hold; $`-x^2`$ has zero derivative at its maximum.
3. Does a zero Hessian at a stationary point settle local optimality?
   - No. At zero, $`x^4`$ has a minimum and $`-x^4`$ has a maximum; both have zero derivative and zero second derivative.
4. Why is $`\mu>0`$ needed for uniqueness?
   - The strong-convexity midpoint inequality subtracts $`\mu\|x-y\|_2^2/8`$. Two distinct minimizers would therefore give a midpoint below the optimal value. Convexity keeps the midpoint feasible; $`\mu>0`$ makes the subtraction strictly positive.

</details>

#### U2. Gradient descent, stochastic gradients and momentum

**About 6 h** · **Target:** Derive + Implement

Topics: Gradient descent on quadratic and general objectives; Stochastic gradients, minibatches and noise; Momentum and acceleration intuition

A controlled quadratic separates curvature-driven instability from gradient noise. It gives you predictions to test before trying an optimizer on a network.

**You can now**

- Derive the stable step-size interval and optimal fixed-step contraction for a positive definite quadratic.
- Implement gradient descent and heavy-ball momentum with explicit initial state and trajectory tests.
- Derive unbiased minibatch gradients and their covariance under independent sampling with replacement.

**Study**

1. [EE364a: descent and line search](https://see.stanford.edu/materials/lsocoee364a/10UnconstrainedMin.pdf) (Stanford EE364a - Convex Optimization) - Lectures 15 and 16 notes: Descent methods (slide 10-5), Line search types (10-6), and Gradient descent method (10-7). Depth: Stop before steepest descent and Newton's method.
2. [Descent on smooth objectives](https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf) (Convex Optimization) - Sections 9.2 and 9.3.1 (pp. 463 to 469). Depth: Use the upper quadratic model to derive $`f(x-\eta g)\le f(x)-\eta(1-L\eta/2)\|g\|_2^2`$. Distinguish this descent guarantee from the exact quadratic contraction below.
3. [GD, stochastic updates and minibatch noise](https://d2l.ai/chapter_optimization/sgd.html) (D2L - Optimization Algorithms) - Sections 12.3.1 to 12.3.2 (Gradient Descent), 12.4.1 to 12.4.2 and 12.4.4 (Stochastic Gradient Descent; 12.4.4 compares sampling with and without replacement), and 12.5.2 (Minibatches). Depth: Follow the adjacent GD and minibatch pages. Use the PyTorch tab for update cells only; skip datasets, training loops and timing claims.
4. [Heavy-ball dynamics on quadratics](https://d2l.ai/chapter_optimization/momentum.html) (D2L - Optimization Algorithms) - Sections 12.6.1.2 to 12.6.1.4 and 12.6.3.1 to 12.6.3.2; PyTorch momentum_2d cell.

**Focus**

- In the eigenbasis, GD errors obey $`e_{k+1,i}=(1-\eta\lambda_i)e_{k,i}`$. Uniform convergence for all starts requires $`0<\eta<2/L`$; $`\eta=2/(L+\mu)`$ minimizes the worst factor to $`(\kappa-1)/(\kappa+1)`$.
- Heavy-ball uses $`x_{k+1}=x_k-\eta\operatorname{grad} f(x_k)+\beta(x_k-x_{k-1})`$. Each eigenmode has characteristic polynomial $`r^2-(1+\beta-\eta\lambda)r+\beta`$; repeated roots can produce a transient $`kr^k`$ factor.
- For $`f=(1/n)\sum f_i`$ and independent uniform indices, the minibatch average gradient is unbiased and has covariance $`\Sigma/B`$. Sampling without replacement has a finite-population correction; reshuffling is not independent sampling.
- On a general $`L`$-smooth lower-bounded objective, the descent lemma controls objective decrease, not global optimality. Report full-objective residuals separately from noisy minibatch gradients.

**Reproduce:** By hand derive the GD eigenmode recurrence and heavy-ball polynomial. In NumPy float64 use $`Q=\operatorname{diag}(1,9)`$, $`x_0=(1,1)`$, $`x_{-1}=x_0`$. After ten updates, GD with $`\eta=0.2`$ has $`\|x_{10}\|_2=0.151850025`$ and $`\|x_{10}\|_2/\|x_0\|_2=0.1073741824=0.8^{10}`$ in exact arithmetic (measured absolute discrepancy 1.4e-17, allow 1e-12). Heavy-ball with $`\eta=0.25`$ and $`\beta=0.25`$ has $`\|x_{10}\|_2=0.0166875073`$. At $`\eta=2/9`$ GD's second coordinate alternates without shrinking; at $`\eta=0.23`$ its magnitude after ten steps is 1.96715136. Then create rng=np.random.default_rng(5); make its only draw noise=rng.standard_normal((10000,4),dtype=np.float64), in array row order. np.var(noise[:,0],ddof=1) is 0.984311 and np.var(noise.mean(axis=1),ddof=1) is 0.251557. Derive the theoretical variances 1 and 1/4; these measured values are not exact theoretical equalities. Allow absolute 1e-6 for the displayed simulation values.

**Traps**

- Including $`2/L`$ in the convergent interval. The largest-curvature mode has multiplier -1 there.
- Claiming momentum contracts by its asymptotic spectral radius at every step. Repeated roots and initial state affect transients.
- Calling the squared-gradient moment a noise variance, or assuming four correlated gradients reduce variance by four. Independence matters.

**Practice**

- [D2L: momentum on multiple eigenvalues](https://d2l.ai/chapter_optimization/momentum.html#exercises) - Section 12.6.5, Exercise 2: $`f(x)=\sum\lambda_ix_i^2/2`$, $`\lambda_i=2^{-i}`$, $`x_i=1`$. Use $`i=0,\ldots,5`$ and record all hyperparameters and initial velocity. Compare equal gradient-evaluation budgets; include an unstable GD step and explain the transient rather than claiming universal momentum acceleration. The section mini-project extends this to minibatch noise.

**Stop when:** Your trajectories match the eigenmode predictions within 1e-12 in Euclidean norm, you explain one boundary failure, and you derive the minibatch covariance with its sampling assumptions.

<details>
<summary>Self-test</summary>

1. Why is the quadratic rate a Euclidean error rate, not the same objective-gap rate?
   - Symmetry gives an orthonormal eigenbasis; positivity gives eigenvalues in $`[\mu,L]`$. Every error multiplier has magnitude at most $`\rho`$, hence $`\|e_k\|_2\le\rho^k\|e_0\|_2`$, including the base case $`k=0`$. The quadratic gap weights squared errors, so it contracts by at most $`\rho^{2k}`$.
2. What happens at $`\eta=2/L`$ if the initial error has no largest-eigenvalue component?
   - It may still converge in the remaining modes. The strict bound guarantees convergence for every initial error, rather than claiming every start fails at the boundary.
3. Why does minibatch covariance divide by B?
   - Center each gradient and expand the covariance of their average. Independence makes cross-covariances zero; identical sampling gives $`B`$ diagonal terms $`\Sigma`$, divided by $`B^2`$. Unbiasedness follows from uniform sampling of the average objective.
4. Does constant-step SGD converge exactly when additive gradient noise persists?
   - Generally no. For scalar curvature $`\lambda`$, independent zero-mean noise variance $`\sigma^2`$ and $`|1-\eta\lambda|<1`$ give limiting error variance $`\eta\sigma^2/(\lambda(2-\eta\lambda))`$. The variance recurrence adds $`\eta^2\sigma^2`$ at every step.

</details>

#### U3. Adaptive optimizers, schedules, clipping and stopping

**About 5 h** · **Target:** Derive + Implement

Topics: Adaptive optimizers, bias correction and weight decay; Learning-rate schedules, clipping and stopping

Adaptive methods carry history as well as parameters. A derivation of that history makes initialization, clipping order and restart errors visible before they affect a training run.

**You can now**

- Derive Adam's zero-initialization bias correction from a finite geometric sum and state its expectation assumptions.
- Distinguish adaptive preconditioning, coupled $`L_2`$ penalties and decoupled weight decay.
- Implement clipping, schedule state and optimizer restart with deterministic trajectory checks.

**Study**

1. [Adaptive preconditioners and bias correction](https://d2l.ai/chapter_optimization/adam.html#the-algorithm) (D2L - Optimization Algorithms) - Sections 12.7.2 to 12.7.3 (Adagrad), 12.8.1 (RMSProp), and 12.10.1 to 12.10.2 (Adam), equations 12.10.1 to 12.10.4 and the PyTorch adam cell. Depth: Follow the adjacent Adagrad and RMSProp pages for their algorithms. Skip dataset training and Yogi; second moments are not centered variances.
2. [Schedule definitions](https://d2l.ai/chapter_optimization/lr-scheduler.html#policies) (D2L - Optimization Algorithms) - Sections 12.11.2 and 12.11.3.1 to 12.11.3.4: Schedulers, Factor, Multi Factor, Cosine and Warmup. Depth: Read the schedule formulas and run the PyTorch learning-rate assignment and scheduler definitions only. Skip Fashion-MNIST training. Define whether your clock counts updates or epochs.
3. [Decoupled decay and optimizer state](https://docs.pytorch.org/docs/2.14/generated/torch.optim.AdamW.html) (PyTorch optimizer and gradient-clipping contracts) - AdamW algorithm box, eps and weight_decay parameters, state_dict and load_state_dict.
4. [Gradient-norm clipping contract](https://docs.pytorch.org/docs/2.14/generated/torch.nn.utils.clip_grad_norm_.html) (PyTorch optimizer and gradient-clipping contracts) - clip_grad_norm_: concatenated-gradient norm, in-place modification, max_norm, norm_type and error_if_nonfinite.

**Focus**

- With $`m_0=0`$, $`m_t=(1-\beta_1)\sum_{i=1}^t\beta_1^{t-i}g_i`$. Constant $`\mathbb{E}[g_i]=\bar{g}`$ gives $`\mathbb{E}[m_t]=(1-\beta_1^t)\bar{g}`$; constant $`\mathbb{E}[g_i^2]`$ gives the analogous second-moment correction. Independence is not needed for these expectations.
- Correction normalizes the finite weights. It does not make $`\hat{m}/\sqrt{\hat{v}}`$ an unbiased gradient estimate when gradients change or the denominator is random.
- Clipping projects $`g`$ onto a Euclidean ball: $`g\min(1,c/\|g\|_2)`$, with zero mapped to zero. Clip before updating moments. AdamW shrinks parameters separately; adding $`\lambda\theta`$ to $`g`$ changes both moments instead.
- A schedule needs a clock and restart state. A small step caused by a tiny learning rate is not evidence of stationarity; check the un-clipped full-objective gradient and use the residual unit's stopping contract.

**Reproduce:** Derive the finite-sum correction by induction, checking $`t=1`$. For constant $`g=(2,-1)`$, $`\beta_1=0.9`$ and $`\beta_2=0.999`$, hand-compute $`m_3=(0.542,-0.271)`$ and $`v_3=(0.011988004,0.002997001)`$; corrected moments are (2,-1) and (4,1) in exact arithmetic. Check in NumPy float64 with infinity-norm tolerance 1e-12. Then run ten float64 updates on $`f(\theta)=(\theta_1^2+9\theta_2^2)/2`$ from (1,-2), $`m_0=v_0=0`$, $`\epsilon=10^{-6}`$, decay=0.1, $`\mathit{lr}_t=0.01/(1+0.1(t-1))`$, $`t=1,\ldots,10`$. Clip $`g`$ to Euclidean norm 1 using the exact formula above; update moments, then $`\theta=(1-\mathit{lr}_t\cdot 0.1)\theta-\mathit{lr}_t\hat{m}/(\sqrt{\hat{v}}+\epsilon)`$. Result: (0.92127176,-1.91402438), allowing 1e-8 in infinity norm for the displayed rounding. Compare torch.optim.AdamW on CPU with float64, the same clipped gradients, betas=(0.9,0.999), eps=1e-6, weight_decay=0.1, foreach=False and the same per-update lr. On PyTorch 2.14.1 the measured infinity-norm difference is 2.22e-16; allow 1e-12. Do not substitute clip_grad_norm_ in this oracle comparison, because its stabilizing denominator changes the mathematical projection slightly. Save $`\theta`$,$`m`$,$`v`$,$`t`$ and the schedule clock after step five and check resumed versus uninterrupted final states within 1e-12. No random draws are needed.

**Traps**

- Starting the bias-correction clock at zero, or incrementing it once per coordinate instead of once per update.
- Putting $`\epsilon`$ inside the square root while claiming the Adam formula with $`\epsilon`$ outside it.
- Restoring parameters but not moments and the schedule clock. The next update is then a different algorithmic state.

**Practice**

- The section mini-project covers this: implement adaptive updates, clipping and update-indexed schedules; test finite-sum moments, checkpoint/resume and an un-clipped stationarity residual on the same deterministic quadratic.

**Stop when:** You can derive the correction with its assumptions and pass moment, decay-placement and restart tests, including the 1e-12 infinity-norm oracle comparison.

<details>
<summary>Self-test</summary>

1. What assumptions does the bias-correction derivation actually use?
   - Zero initial moments remove a $`\beta^tm_0`$ term. Constant $`\beta`$ in $`[0,1)`$ supplies the finite geometric sum and a nonzero denominator for $`t\ge 1`$. Equal first or second moments of the gradient sequence let expectation factor out of the weighted sum. Independence is not required.
2. Why is Adam's vhat not the gradient variance?
   - It estimates an uncentered second moment. Variance subtracts the square of the mean; vhat does not.
3. When does coupled $`L_2`$ match decoupled decay?
   - For plain SGD with no momentum or preconditioner, $`\theta-\eta(g+\lambda\theta)`$ equals $`(1-\eta\lambda)\theta-\eta g`$ in exact arithmetic. Adaptive scaling or momentum generally destroys this equivalence.
4. What is the norm-clipping solution for $`g=(3,4)`$ and $`c=2`$?
   - Its norm is 5, so the projection is (1.2,1.6). Clamping each coordinate to [-2,2] gives (2,2), which is a different projection and exceeds norm 2.

</details>

#### U4. Constraints, KKT conditions and proximal methods

**About 6 h** · **Target:** Derive

Topics: Constrained optimization, Lagrangians and KKT conditions; Regularization and proximal intuition

Constraints and nonsmooth penalties need more than a zero ordinary gradient. KKT residuals and proximal fixed points provide certificates that an optimizer's loss curve cannot.

**You can now**

- Derive a small quadratic program's Lagrangian, dual lower bound and KKT certificate by hand.
- Explain complementary slackness and where convexity and a constraint qualification enter optimality claims.
- Derive soft thresholding and the proximal-gradient update for the lasso, then check both examples against independent answers.

**Study**

1. [Lagrangian lower bounds and KKT certificates](https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf) (Convex Optimization) - Sections 5.1.1 to 5.1.3 (pp. 215 to 216), 5.2.2 to 5.2.3 (pp. 225 to 227), and 5.5.1 to 5.5.3 (pp. 241 to 245). Depth: Stop 5.5.3 after Example 5.1 on p. 244. Keep only the duality needed to explain weak duality, Slater's condition and the small QP; leave broader duality theory aside.
2. [Solver status and dual values](https://www.cvxpy.org/tutorial/intro/index.html) (CVXPY basic and DCP tutorials) - Changing the problem, Infeasible and unbounded problems, and Other problem statuses. Depth: Use the solver only after deriving the analytic solution. Accept neither optimal_inaccurate nor an iteration cap as an unchecked certificate.
3. [Read multipliers from the solver answer](https://www.cvxpy.org/tutorial/advanced/index.html#dual-variables) (CVXPY basic and DCP tutorials) - Dual variables: constraint.dual_value and the two-scalar example. Depth: Read this heading only; none of the other advanced features are assigned.
4. [Proximal maps, soft thresholding and lasso](https://web.stanford.edu/~boyd/papers/pdf/prox_algs.pdf) (Proximal Algorithms) - Sections 1.1 (p. 124), 4.2 (pp. 148 to 151), 6.5.2 (p. 188, equation 6.9), and 7.1's lasso formulation (p. 196). Depth: In 4.2 read the basic update and quadratic upper-model interpretation. Skip accelerated methods and ADMM. In 6.5.2 stop before projection onto the $`\ell_1`$ ball. Skip 7.1.1 on p. 197: it prints $`\operatorname{prox}_{\gamma g}=S_\gamma`$ although $`g=\gamma\|x\|_1`$; the correct general scaling is $`\operatorname{prox}_{\eta g}=S_{\eta\gamma}`$. Its Gram rewrite with $`\tilde{b}=A^\top b`$ also fails to preserve the linear term, already for $`A=[2]`$, $`b=[1]`$. Derive lasso's update from 4.2 and 6.5.2 instead.

**Focus**

- Write inequalities as $`f_i(x)\le 0`$ and attach nonnegative multipliers. The dual function minimizes the Lagrangian over $`x`$ without imposing the original constraints; weak duality gives a lower bound.
- KKT comprises primal feasibility, dual feasibility, stationarity and complementary slackness. For a differentiable convex problem with affine equalities, KKT is sufficient; Slater's condition supplies necessity and dual attainment when a primal optimum exists.
- For $`0.5\|Aw-b\|_2^2+\lambda\|w\|_1`$, proximal gradient takes $`u=w-\eta A^\top(Aw-b)`$, then $`w+=\operatorname{sign}(u)\max(|u|-\eta\lambda,0)`$. The threshold scales with $`\eta`$, not just $`\lambda`$.
- At zero, the $`\ell_1`$ subgradient is the interval $`[-1,1]`$. Derive the three scalar cases instead of pretending $`\operatorname{abs}`$ has a unique derivative there. For the smooth part, $`\eta\le 1/\|A\|_2^2`$ gives the quadratic upper-model descent argument.

**Reproduce:** By hand minimize $`0.5\|x-a\|_2^2`$ with $`a=(2,-1)`$, $`x\ge 0`$ and $`x_1+x_2=1`$. Use $`L=0.5\|x-a\|_2^2-\lambda^\top x+\nu(\operatorname{sum}(x)-1)`$. Obtain $`x^*=(1,0)`$, $`\lambda^*=(0,2)`$, $`\nu^*=1`$ and primal value 1. Derive $`g(\lambda,\nu)=0.5\|a\|_2^2-0.5\|a+\lambda-\nu\mathbf{1}\|_2^2-\nu`$; its value at the certificate is 1. In CVXPY 1.9.3 use float64 a, z=cp.Variable(2), constraints=[z>=0,cp.sum(z)==1], objective=cp.Minimize(0.5*cp.sum_squares(z-a)); form prob=cp.Problem(objective,constraints) and call prob.solve(solver='CLARABEL',tol_gap_abs=1e-10,tol_gap_rel=1e-10,tol_feas=1e-10,max_iter=100). Read lam=constraints[0].dual_value and nu=constraints[1].dual_value; lam represents the mathematical $`\lambda`$, and use z.value for numerical checks. Status is optimal. Measured residuals: max(0,max(-z.value))=8.08e-13, abs(sum(z.value)-1)=1.11e-16, max(0,max(-lam))=0, ||z.value-a-lam+nu||_inf=1.22e-11 and ||lam*z.value||_inf=4.56e-11. ||z.value-(1,0)||_inf=8.08e-13. Require every residual and the solution difference $`\le 10^{-9}`$, rather than exact feasibility. Then derive the scalar soft-threshold map and work $`A=I_2`$, $`b=(2,-0.25)`$, $`\lambda=0.5`$ by hand: $`w^*=(1.5,0)`$. From $`w_0=(0,0)`$, take 30 NumPy float64 proximal steps with $`\eta=0.5`$; the infinity-norm error against this closed form is 1.40e-9, allowed $`\le 2\times 10^{-9}`$. No random draws are needed.

**Traps**

- Giving $`x\ge 0`$ the wrong multiplier sign. Its standard-form constraint is $`-x\le 0`$, so stationarity contains $`-\lambda`$.
- Inferring a positive multiplier from an active constraint. Complementary slackness only says a positive multiplier implies activity, not the converse.
- Using ridge's shrinkage as lasso's proximal operator. Ridge scales coordinates continuously; lasso thresholds a whole interval to zero.

**Practice**

- The section mini-project covers this: derive and solve a changed two-coordinate QP, record all KKT residuals and solver status, and derive soft thresholding before checking a lasso proximal loop against a closed form and a solver oracle.

**Stop when:** You can derive the QP certificate and threshold endpoints unaided, and your NumPy and solver checks pass their stated infinity-norm and feasibility tolerances.

<details>
<summary>Self-test</summary>

1. Where does each assumption enter the KKT sufficiency proof?
   - Convex objective and inequality functions, affine equalities, and nonnegative multipliers make $`L`$ convex in $`x`$. Differentiability and stationarity therefore minimize $`L`$ globally. Feasibility and complementary slackness make $`L(x^*)=f(x^*)`$. The dual infimum is then $`f(x^*)`$, so weak duality certifies optimality. Slater is not needed for sufficiency.
2. Does this QP satisfy Slater's condition?
   - Yes. $`x=(0.5,0.5)`$ strictly satisfies $`-x<0`$ and satisfies the affine equality. This supplies the constraint qualification; the strictly convex objective also makes the primal optimizer unique.
3. Why is the proximal minimizer zero when $`|u|\le\eta\lambda`$?
   - At $`w=0`$ the stationarity inclusion is $`0\in -u+\eta\lambda[-1,1]`$, exactly that inequality. The quadratic term is strictly convex, so this condition identifies the unique minimizer, including both threshold endpoints.
4. How can you check a lasso answer without knowing w*?
   - Let $`h=A^\top(Aw-b)`$. Nonzero coordinates need $`h_i+\lambda\operatorname{sign}(w_i)=0`$; zero coordinates need $`|h_i|\le\lambda`$. Check these residuals with a stated numerical zero threshold, or use $`\|w-S_{\eta\lambda}(w-\eta h)\|/\eta`$ as a proximal-gradient residual.

</details>

#### U5. Newton and quasi-Newton methods

**About 4 h** · **Target:** Derive

Topics: Newton and quasi-Newton methods

Second-order methods show what curvature information can buy and what it costs. This optional unit separates fast local convergence from an unjustified global guarantee.

**You can now**

- Derive the Newton step from a quadratic model and explain when it is a descent direction.
- Prove a local quadratic error recurrence and identify the smoothness, nondegeneracy and starting-point assumptions.
- Compare Newton with a quasi-Newton solver using stationarity residuals and separate function, gradient and Hessian evaluation counts.

**Study**

1. [Newton's model, line search and convergence](https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf) (Convex Optimization) - Sections 9.5.1 to 9.5.3 (pp. 484 to 491), and the Summary on p. 496. Depth: Read the step, decrement and proof assumptions; follow the quadratically convergent phase argument on pp. 490 to 491. Skip 9.5.4's large numerical examples and 9.6.
2. [Newton as rootfinding](https://fncbook.com/python/newton/) (Fundamentals of Numerical Computation) - Section 4.3.1, equations 4.3.3 to 4.3.8, and Section 4.3.2's newton algorithm. Depth: Apply the rootfinding argument to the objective's derivative. Inspect the stopping conditions rather than treating small successive steps as a certificate.
3. [A quasi-Newton comparison with an analytic gradient](https://docs.scipy.org/doc/scipy/reference/optimize.minimize-bfgs.html) (SciPy minimize: BFGS) - BFGS method; options gtol, maxiter, c1, c2 and hess_inv0; Notes on precision loss. Depth: Use the default line-search parameters and initial inverse-Hessian approximation. Do not study or implement a full BFGS convergence proof here.

**Focus**

- Minimizing the local quadratic model gives $`Hp=-g`$. Solve this system instead of forming $`H^{-1}`$. Positive definite $`H`$ makes $`g^\top p<0`$ for nonzero $`g`$; an indefinite Hessian does not.
- A Lipschitz Hessian and a uniformly bounded inverse Hessian near a nondegenerate minimizer give a quadratic error bound for full Newton steps, once the starting point is close enough. Backtracking handles the approach to that neighborhood.
- Quasi-Newton methods replace freshly evaluated curvature with an approximation informed by gradient changes. Their iteration count alone hides line-search evaluations; BFGS is an oracle here, not a second implementation assignment.

**Reproduce:** By hand minimize $`\phi(x)=x^4/4+x^2/2-2x`$ on $`\mathbb{R}`$. Its gradient is $`x^3+x-2`$, Hessian $`3x^2+1`$, and unique minimizer $`x^*=1`$. Derive Newton's update and the exact recurrence $`e_{\text{next}}=e^2(2x+1)/(3x^2+1)`$, where $`e=x-1`$. Starting at $`x_0=1.5`$, use NumPy float64 for four updates: absolute errors after each are 0.1290322581, 0.01124439868, 9.394478985e-5 and 6.618699366e-9. Compare each displayed error with absolute tolerance 1e-10. The first four ratios $`|e_{\text{next}}|/e^2`$ are 0.516129, 0.675367, 0.743020 and 0.749941, approaching 3/4; stop the rate measurement before rounding dominates. With SciPy 1.18.1, call minimize on the same scalar objective with x0=np.array([1.5],dtype=np.float64), jac returning np.array([x[0]**3+x[0]-2],dtype=np.float64), method='BFGS', options={'gtol':1e-10,'maxiter':100}. It reports success, eight iterations, nine function and nine gradient evaluations, and gradient infinity norm 1.32e-13. Require $`|x-1|\le 10^{-9}`$ and $`\|\operatorname{grad}\|_\infty \le 10^{-10}`$; compare work at that residual, counting Newton's derivative and Hessian calls too. Do not infer a timing advantage. No random draws are needed.

**Traps**

- Applying the rootfinding Newton formula to $`\phi`$ rather than $`\phi'`$. That finds a zero of the loss, not its stationary point.
- Claiming quadratic convergence at a multiple root, or from every starting point. A vanishing derivative breaks the local denominator bound.
- Counting BFGS iterations while ignoring its line-search calls, or interpreting solver success without checking the returned gradient.

**Practice**

- [FNC Python: multiple-root Newton convergence](https://fncbook.com/python/newton/#problem-newton-multiple) - Exercise 4.3.7, parts (a) and (b). Attempt the repeated-root derivation before reading the nearby convergence discussion. For part (b), use float64 and separate errors from residuals; do not fit a convergence rate to the final roundoff plateau.

**Stop when:** You can derive the error recurrence, name every local assumption, and explain the Newton/BFGS comparison without treating iteration count or a roundoff plateau as a speed or rate proof.

<details>
<summary>Self-test</summary>

1. Why does this example converge to 1 from 1.5?
   - For $`x>1`$, the recurrence gives $`e_{\text{next}}>0`$. Also $`e_{\text{next}}/e=(x-1)(2x+1)/(3x^2+1)<1`$ because the denominator minus the numerator is $`x^2+x+2>0`$. The iterates decrease and stay above 1; their limit must solve $`x^3+x-2=0`$. Positive Hessian makes that root unique. Dividing the recurrence by $`e^2`$ gives the limit 3/4.
2. Where are the local Newton proof assumptions used?
   - A Lipschitz Hessian bounds the Taylor remainder by a constant times $`\|e\|_2^2`$. Nonsingularity and local inverse bounds keep solving with $`H`$ from amplifying it without limit. A sufficiently close start keeps the iterates in that neighborhood; full steps give the Newton error cancellation.
3. What happens to Newton rootfinding for $`F(x)=(x-r)^2`$?
   - For $`x\ne r`$ the update is $`x_{\text{next}}=x-(x-r)/2`$, so $`e_{\text{next}}=e/2`$: linear, not quadratic. The simple-root assumption fails because $`F'(r)=0`$.
4. Must a Newton direction descend at a stationary saddle?
   - No. At a stationary point $`g=0`$, the Newton step is zero when the Hessian is invertible, even if the point is a saddle. Away from it, an indefinite Hessian can also give a non-descent direction.

</details>

#### U6. Floating point, rounding, overflow and cancellation

**About 4 h** · **Target:** Derive + Measure

Topics: Floating-point representation, rounding and machine precision; Overflow, underflow and catastrophic cancellation

Mathematical real arithmetic is not a machine's arithmetic. A dtype's range and spacing predict different failures, and rewriting a formula can matter more than increasing precision.

**You can now**

- Derive spacing and unit roundoff from a binary significand and distinguish precision from exponent range.
- Compare float64, float32, float16 and bfloat16, including normal and subnormal values.
- Construct overflow, underflow and cancellation failures and check an algebraically stable alternative.

**Study**

1. [Binary representation and rounding](https://fncbook.com/python/floating-point/) (Fundamentals of Numerical Computation) - Section 1.1: Definitions 1.1.1 to 1.1.2, equations 1.1.1 to 1.1.6, and Sections 1.1.2 to 1.1.3. Depth: Use the Python examples. The main-text minimum-range discussion concerns normal values; read footnote 2 and the dtype reference below before treating $`\mathit{tiny}`$ as the smallest positive representable value. Skip the Julia-specific Exercise 1.1.5.
2. [Conditioning and unstable cancellation](https://fncbook.com/python/stability/) (Fundamentals of Numerical Computation) - Sections 1.2.1 to 1.2.2, condition numbers and error estimates, on the preceding Problems and conditioning page; Section 1.4.1 and Examples 1.4.1 to 1.4.2 on Stability. Depth: Focus on subtractive cancellation and the stable quadratic-root rewrite; skip the later polynomial-root perturbation demo.
3. [Inspect low-precision formats](https://docs.pytorch.org/docs/2.14/type_info.html) (PyTorch numerical type information) - torch.finfo: bits, eps, max, tiny, smallest_normal and the note about subnormal numbers.

**Focus**

- With $`p`$ total significand bits including the hidden leading one, spacing in $`[2^e,2^{e+1})`$ is $`2^{e-(p-1)}`$. $`\mathit{eps}`$ is the gap above 1; unit roundoff for round-to-nearest is $`\mathit{eps}/2`$. The relative bound needs normal-range results and no overflow.
- float64, float32, float16 and bfloat16 have $`p=53,24,11,8`$ and exponent fields of 11,8,5,8 bits respectively. bfloat16 has wide range but coarser spacing than float16.
- Overflow produces infinities; gradual underflow first reaches subnormals with reduced relative precision. $`\mathit{tiny}`$ is the smallest positive normal, not the smallest positive representable value.
- Subtracting nearby rounded operands can destroy relative accuracy even when the subtraction itself is exact. Separate conditioning of the requested difference from avoidable instability in how its operands were formed.

**Reproduce:** By hand enumerate the $`d=4`$ fractional-bit system in FNC Exercise 1.1.1 and derive its spacing. Then use np.finfo for np.float64, np.float32 and np.float16, and torch.finfo(torch.bfloat16) on CPU for bfloat16. Print eps, tiny and max to three significant digits: float64 (2.22e-16,2.23e-308,1.80e308), float32 (1.19e-7,1.18e-38,3.40e38), float16 (9.77e-4,6.10e-5,6.55e4), bfloat16 (7.81e-3,1.18e-38,3.39e38). Derive $`\mathit{eps}=2^{-(p-1)}`$ and check each $`\mathit{eps}`$ within relative scalar tolerance 1e-6. Inspect np.nextafter(dtype(0),dtype(1)), and torch.nextafter on CPU bfloat16 scalars, to see values below $`\mathit{tiny}`$. In NumPy float64 set x=np.float64(1e8): $`\sqrt{x^2+1}-x`$ returns 0, while $`1/(\sqrt{x^2+1}+x)`$ returns about 5.00e-9. Rationalize the expression by hand and bound the exact result's difference from $`1/(2x)`$ by $`1/(8x^3)`$; allow absolute 1e-20 for the stable scalar. Finally evaluate np.exp(np.float64(1000)) and np.exp(np.float64(-1000)) inside np.errstate(over='ignore',under='ignore'): outputs are inf and 0. These are range failures, not exact evaluations of $`\exp`$. No random draws are needed.

**Traps**

- Calling $`\mathit{eps}`$ the smallest representable number, or calling finfo.tiny the smallest subnormal.
- Assuming bfloat16 is more precise because its exponent range is larger.
- Applying a relative error tolerance at a true zero, or claiming that a stable rewrite recovers information already rounded out of its inputs.

**Practice**

- [FNC Python: enumerate a toy format and derive single precision](https://fncbook.com/python/floating-point/#exercises) - Exercises 1.1.1 (a) to (c) and 1.1.4 (a) to (b). Attempt by hand before using finfo or nextafter. Translate the single-precision checks to NumPy float32 rather than the exercise's Julia type name.

**Stop when:** You can derive each format's spacing, distinguish $`\mathit{eps}`$ from normal and subnormal limits, and explain why the stable cancellation rewrite passes its absolute-error check while the naive formula fails.

<details>
<summary>Self-test</summary>

1. Why is round-to-nearest error bounded by eps/2 in the normal range?
   - In each binade the absolute error is at most half its spacing. Dividing by $`|x|\ge 2^e`$ bounds relative error by $`2^{-(p-1)}/2`$. The lower bound on $`|x|`$ uses normal binade representation; subnormals instead have fixed absolute spacing. Overflow is excluded.
2. What is lost in $`\sqrt{x^2+1}-x`$ at $`x=10^8`$?
   - $`x^2`$ is about $`10^{16}`$, where float64 spacing is 2, so adding 1 rounds away under ties-to-even. The square root returns $`x`$ and subtraction gives zero. Rationalization avoids subtracting nearly equal operands; it does not make $`x^2+1`$ exact.
3. Is the computed zero an underflow of the true answer?
   - No. The true answer is about 5e-9, well within the normal float64 range. It is cancellation after an earlier rounding loss.
4. Can $`(1+\mathit{eps}/2)-1`$ and $`1+(\mathit{eps}/2-1)`$ differ in float64?
   - Yes. Under round-to-nearest ties-to-even, the first evaluates to zero and the second to about 1.11e-16. The real-arithmetic associative law does not transfer to rounded operations.

</details>

#### U7. Stable log-sum-exp, online reductions and mixed precision

**About 6 h** · **Target:** Derive + Implement

Topics: Stable softmax, log-sum-exp and online reductions; Mixed precision and accumulation choices

Long reductions can fail even when each individual input is representable. Stable identities and explicit accumulator dtypes give you independent checks beneath probability losses and mixed-precision training.

**You can now**

- Derive log-sum-exp's shift identity, max bounds and convexity without relying on a loss implementation.
- Implement naive, balanced pairwise and Kahan reductions and distinguish an error bound from a measured error.
- Prove online mean and centered-sum invariants and test low-precision storage with higher-precision accumulation.

**Study**

1. [Log-sum-exp as a smooth convex maximum](https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf) (Convex Optimization) - Section 3.1.5: Log-sum-exp bounds on p. 72 and the Hessian/Cauchy-Schwarz proof on p. 74. Depth: Read only the log-sum-exp passages. Derive the max-shift identity yourself; leave gradients of a classification loss to the linked later unit.
2. [Summation trees and compensation](https://nhigham.com/wp-content/uploads/2023/10/high93s.pdf) (The Accuracy of Floating Point Summation) - Section 2 (pp. 784 to 786), especially equations 2.1 to 2.6; Section 3's general error expression and pairwise summation (pp. 787 to 788) and Kahan's compensated summation (pp. 790 to 791, equation 3.10 on p. 791). Depth: Skip Section 2's sorting examples and Section 3's insertion and +/- methods. Derive the basic recursive bound, then inspect the balanced-tree and compensated algorithms; no probabilistic rounding model is assigned.
3. [Online mean and centered second moment](https://www.johndcook.com/blog/standard_deviation/) (Accurately computing running variance) - Opening cancellation example and recurrence formulas for $`M_k`$, $`S_k`$ and sample variance $`S_k/(k-1)`$. Depth: Stop before the C++ RunningStat class. Prove the invariant in exact arithmetic before translating it to NumPy. A variance can be zero, and overflow can still occur.
4. [Precision budget for inputs and accumulators](https://docs.pytorch.org/docs/2.14/type_info.html) (PyTorch numerical type information) - torch.finfo: eps, max and smallest_normal for float16, bfloat16, float32 and float64.

**Focus**

- For finite nonempty $`x`$, $`\operatorname{LSE}(x)=m+\log(\sum\exp(x_i-m))`$, $`m=\max x`$. Every exponential is $`\le 1`$ and at least one is 1, giving $`m\le\operatorname{LSE}\le m+\log(n)`$. The Hessian $`\operatorname{diag}(p)-pp^\top`$ is PSD by a weighted-variance argument.
- With unit roundoff $`u`$, no overflow or underflow and $`(n-1)u<1`$, recursive summation has absolute error $`\le\gamma_{n-1}\sum|x_i|`$, $`\gamma_k=ku/(1-ku)`$. A balanced tree shortens rounding paths; it does not remove conditioning from cancellation.
- Online mean uses $`\delta=x_n-\mathit{mean}_{\text{old}}`$ and $`\mathit{mean}_{\text{new}}=\mathit{mean}_{\text{old}}+\delta/n`$. The centered sum updates $`M2_{\text{new}}=M2_{\text{old}}+\delta(x_n-\mathit{mean}_{\text{new}})`$. Check $`M2_n=\sum(x_i-\mathit{mean}_n)^2`$ with base case $`n=1`$, and divide by $`n-1`$ only for sample variance with $`n\ge 2`$.
- Higher-precision accumulation can prevent repeated rounding of the running total. It cannot restore detail lost when input values were quantized; distinguish operand, product and accumulator precision.

**Reproduce:** Derive the $`\operatorname{LSE}`$ max bounds and Hessian PSD proof, and prove the online centered-sum invariant by induction. Hand-check data [1,2,3]: mean=2, M2=2, sample variance=1. In NumPy float64 use x=[1000,1001,999]; the shifted formula gives 1001.4076059644, allowing 1e-10 absolute error for this displayed rounding. Compare the unrounded result with scipy.special.logsumexp on SciPy 1.18.1: measured absolute difference is 0; require $`\le 10^{-12}`$, not exact equality. Implement a left-to-right sum with float64 accumulator zero, a balanced sum splitting each array at len(a)//2 recursively (empty sum zero, singleton returns its value), and Kahan with s=c=0; for each v use y=v-c, t=s+y, c=(t-s)-y, s=t. On np.concatenate((np.array([1e16],dtype=np.float64),np.ones(1024,dtype=np.float64),np.array([-1e16],dtype=np.float64))), the outputs are 0, 1022 and 1024. Against math.fsum's 1024 the measured absolute errors are 1024, 2 and 0; allow 1e-12 for these displayed checks. Run the online recurrence on [1e8+1,1e8+2,1e8+3] in that order in float64: sample variance is 1, while $`(\operatorname{sum}(x^2)-3\operatorname{mean}(x)^2)/2`$ gives 0. The absolute difference from np.var(x,ddof=1) for the online result is 0, allowed $`\le 10^{-12}`$. Finally sum 4096 float16 ones left-to-right, explicitly casting every updated accumulator to np.float16: the total stalls at 2048. np.sum on those same inputs with dtype=np.float32 gives 4096; measured absolute errors against the integer count are 2048 and 0. No random draws are needed. These examples do not establish that Kahan or an online variance algorithm wins for every input.

**Traps**

- Using np.sum as a claimed naive left-to-right baseline. Its reduction strategy depends on axis and layout; implement the order you claim to test.
- Rearranging Kahan's compensation into algebraically equivalent operations. Reassociation changes the rounding errors the correction is meant to retain.
- Ignoring empty inputs, infinities or the $`n=1`$ sample-variance denominator. The finite nonempty $`\operatorname{LSE}`$ contract and $`n\ge 2`$ variance contract need explicit checks.

**Practice**

- The section mini-project covers this: derive and implement a finite-input log-partition primitive, three explicit summation orders and online mean/variance; test cancellation, large offsets, low-precision storage and accumulator choices against independent oracles.

**Stop when:** Your reduction and online-state tests reproduce the stated absolute errors, and you can prove the $`\operatorname{LSE}`$ bounds and centered-sum invariant while explaining which precision losses cannot be repaired.

<details>
<summary>Self-test</summary>

1. Why is the LSE Hessian positive semidefinite but not positive definite?
   - For finite $`x`$, $`p_i=\exp(x_i)/\sum\exp(x_j)`$ are positive and sum to one. $`v^\top(\operatorname{diag}(p)-pp^\top)v=\sum p_i(v_i-\sum p_jv_j)^2\ge 0`$. Positivity makes this a weighted variance; constant $`v`$ gives zero, so the all-ones direction is a null direction.
2. Where does the online centered-sum proof use its assumptions?
   - At $`n=1`$, $`\mathit{mean}=x_1`$ and $`M2=0`$. For $`n\ge 2`$, the old centered deviations sum to zero, so recentering the first $`n-1`$ values adds $`(n-1)(\delta/n)^2`$ with no cross term. The new deviation is $`\delta(n-1)/n`$; adding its square gives $`\delta^2(n-1)/n=\delta(x_n-\mathit{mean}_{\text{new}})`$. Division uses $`n>0`$; the algebra assumes exact arithmetic, not an exact floating-point invariant.
3. Why can a small absolute summation error be a large relative one?
   - Cancellation can make $`|\sum x_i|`$ tiny while $`\sum|x_i|`$ is large. The relative error bound contains their ratio, the summation condition number. At a zero exact sum use an absolute criterion instead.
4. Does float32 accumulation make float16 inputs equivalent to original float32 inputs?
   - No. It improves the accumulation of already rounded inputs. Any distinction erased by conversion to float16 is still gone, even if every later addition were exact.

</details>

#### U8. Residuals, tolerances and iterative-solver error

**About 3 h** · **Target:** Derive + Measure

Topics: Residuals, tolerances and iterative-solver error

A solver stops because of a rule, not because mathematics declares the answer correct. Residual scaling and conditioning tell you what that rule actually certifies.

**You can now**

- Derive the relationship between a linear-system residual, solution error and conditioning.
- Design norm-specific absolute and relative residual tests with meaningful scales.
- Distinguish residual convergence, stagnation, non-finite failure and iteration-cap termination.

**Study**

1. [Linear residuals and conditioning](https://fncbook.com/python/condition-number/) (Fundamentals of Numerical Computation) - Section 2.8.1, Theorem 2.8.1; Section 2.8.2, Residual and backward error, Definition 2.8.2 and equation 2.8.11. Depth: Keep the normwise residual/error relationship. Do not reproduce the later least-squares solver comparison.
2. [Fixed-point errors versus iteration stopping](https://fncbook.com/python/fixed-point/) (Fundamentals of Numerical Computation) - Sections 4.2.1 to 4.2.3, equations 4.2.2 to 4.2.7, Theorem 4.2.1 and Corollary 4.2.1; then Section 4.3.2's newton stopping implementation. Depth: Observation 4.2.1 says the iteration diverges for all initial values when $`|g'(p)|>1`$; read that as a local statement, since starting at $`p`$ stays at $`p`$. Theorem 4.2.1 as printed allows any invariant interval, but existence needs completeness: $`x/2`$ maps $`(0,1)`$ into itself with no fixed point there. Read it with $`S`$ a closed interval, then finish the existence step yourself in the self-test. Read the scalar stopping loop on the Newton page, not its graphical demos.
3. [Objective certificates rather than tiny steps](https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf) (Convex Optimization) - Section 5.5.1 (pp. 241 to 242) and Section 9.1.2, equations 9.9 to 9.10 (p. 460) and the strong convexity constants paragraph (p. 463). Depth: Read only primal-dual gap stopping and the strong-convexity gradient-to-suboptimality bound, including why an unknown m makes that bound a conceptual rather than practical stopping rule.

**Focus**

- For invertible $`A`$, $`r=b-A\hat{x}=A(x^*-\hat{x})`$. Hence $`\|\hat{x}-x^*\|_2\le\|A^{-1}\|_2\|r\|_2`$; when $`b`$ and $`x^*`$ are nonzero, relative error $`\le\kappa_2(A)\|r\|_2/\|b\|_2`$.
- A scale-aware residual test is $`\|r\|_2\le\mathit{atol}+\mathit{rtol}\|b\|_2`$. State the norm, units, $`\mathit{atol}`$ and $`\mathit{rtol}`$. The normalized residual $`\|r\|_2/(\|A\|_2\|\hat{x}\|_2+\|b\|_2)`$ is a useful normwise backward-error measure, not a forward-error certificate.
- For a $`\mu`$-strongly-convex differentiable unconstrained objective, $`\|\operatorname{grad} f(x)\|_2^2/(2\mu)`$ bounds the objective gap. Constraints and nonsmooth penalties need KKT or proximal residuals instead; noisy gradients are not exact stationarity residuals.
- Check finite values first, then residual convergence, then stagnation and the iteration limit. Small successive steps can reflect poor scaling or rounding. Report the reason for exit rather than labeling every exit converged.

**Reproduce:** Derive the residual-to-error bound by hand. In NumPy float64 set A=diag(1,1e-8), xstar=np.ones(2,dtype=np.float64), b=A@xstar and xhat=np.array([1,0],dtype=np.float64). Compute r=b-A@xhat: $`\|r\|_2=10^{-8}`$, relative residual=1e-8, relative solution error=0.7071067812, $`\kappa_2(A)=10^8`$, and normalized residual=5e-9 using the denominator $`\|A\|_2\|\hat{x}\|_2+\|b\|_2`$. Allow relative scalar tolerance 1e-9 for these displayed nonzero quantities. The relative-error bound is 1, so the large observed error does not contradict it. An absolute-only threshold 1e-7 accepts this poor answer. With $`\mathit{atol}=10^{-12}`$ and $`\mathit{rtol}=10^{-10}`$, the Euclidean residual test rejects it. Multiply both $`A`$ and $`b`$ by $`10^8`$: the residual becomes 1 and the relative residual remains about 1e-8; the same combined test rejects it again. Take one correction xhat+=np.linalg.solve(A,r) using the original A and r. The measured final Euclidean error and residual are both 0; require $`\le 10^{-12}`$ rather than exact equality. Finally work the harmonic partial sums $`H_n`$ by hand: successive increments tend to zero although $`H_n`$ diverges. Use this to justify a stagnation status separate from residual convergence. No random draws are needed.

**Traps**

- Treating a tiny residual as a tiny solution error without checking the inverse sensitivity or condition number.
- Using a relative-only tolerance when the target scale is zero, or comparing residuals in different units without rescaling atol.
- Declaring convergence at maxiter or after a small update even though the residual test failed.

**Practice**

- [FNC Python: foil the successive-step stopping indicator](https://fncbook.com/python/newton/#problem-newton-stopping) - Exercise 4.3.8. The harmonic sums in Reproduce are one answer; find a different foiling sequence and prove both properties. Explain why a shrinking update alone is insufficient, then specify finite-value, residual, stagnation and iteration-cap statuses for your own loop.

**Stop when:** You can derive the conditioning bound, explain the small-residual counterexample, and defend a norm-and-scale-specific stopping rule that never labels stagnation or an iteration cap as residual convergence.

<details>
<summary>Self-test</summary>

1. Which assumptions are used in the relative residual bound?
   - Invertibility gives $`x^*-\hat{x}=A^{-1}r`$. Consistent operator and vector norms give $`\|\text{error}\|\le\|A^{-1}\|\|r\|`$ and $`\|b\|\le\|A\|\|x^*\|`$. Combine them to get the relative bound; $`b`$ and $`x^*`$ must be nonzero to divide by their norms. No random or convergence assumption is needed.
2. Why does multiplying A and b by the same nonzero scalar leave relative residual unchanged?
   - Both $`\|r\|`$ and $`\|b\|`$ acquire the scalar's absolute magnitude. The solution is unchanged, but an absolute residual tolerance must be rescaled to preserve the same test exactly.
3. Why do vanishing harmonic increments not establish convergence?
   - $`H_{n+1}-H_n=1/(n+1)`$ tends to zero. But each block from $`2^{k-1}+1`$ through $`2^k`$ contributes at least $`1/2`$, because it has $`2^{k-1}`$ terms each at least $`1/2^k`$. Thus $`H_{2^k}\ge 1+k/2`$, including $`k=0`$, and the sums diverge.
4. What does a primal-dual gap certify, and what must be checked first?
   - For primal-feasible $`x`$ and dual-feasible multipliers, weak duality bounds $`f(x)-p^*`$ by $`f(x)-g`$. Check both feasibilities before interpreting the gap. Strong duality is needed to make arbitrarily tight such certificates possible, not for this lower-bound argument.
5. What makes the contraction-mapping existence guarantee valid?
   - A nonempty complete domain, such as a closed interval of $`\mathbb{R}`$, an invariant map $`g(S)`$ contained in $`S`$, and a global Lipschitz constant $`q<1`$. Invariance keeps all iterates in $`S`$; the contraction bounds successive differences by a geometric sequence, hence the iterates are Cauchy. Completeness puts the limit in $`S`$, and continuity gives $`g(p)=p`$. The contraction also proves uniqueness. An open interval alone does not provide completeness.

</details>

### Mini-project: An optimizer and numerics test bench

**About 12 to 16 hours.** Add optim/ to numlab: gradient descent, heavy-ball and AdamW with clipping, schedules and restartable state; a KKT and proximal-gradient pair checked against a solver; and the stable reductions. Compare the optimizers on changed geometry against eigenvalue predictions, then diagnose one divergence and one finite-precision failure.

1. Implement gradient descent, heavy-ball and AdamW with norm clipping (the exact projection), an update-indexed schedule and a state object holding parameters, moments, step count and schedule clock. Every loop exits with one status: residual converged, stagnated, non-finite or iteration cap, and a test forces each one.
2. Run all three on quadratics with condition numbers 10, 100 and 1000, once diagonal and once rotated by a random orthogonal matrix. Before running, predict the gradient-descent rate from the eigenvalues; report the full gradient norm and objective gap against gradient evaluations, and compare with the prediction.
3. Diagnose one divergence: take a step slightly above $`2/L`$, project the iterates onto the eigenvectors and show that only the top mode grows, at the predicted factor $`|1-\eta L|`$ per step. Then add minibatch noise to a finite-sum least-squares problem: check the with-replacement gradient covariance $`\Sigma/B`$ empirically and the constant-step plateau variance against $`\eta\sigma^2/(\lambda(2-\eta\lambda))`$ on a scalar model.
4. Feed a constant gradient $`g`$ and check the moments against the finite geometric sums $`(1-\beta_1^t)g`$ and $`(1-\beta_2^t)g^2`$. Then, on one deterministic quadratic, match torch.optim.AdamW in float64 on the same clipped gradients and per-step learning rates, as in the adaptive unit. Save the state halfway, resume and check the final state against an uninterrupted run within 1e-12, and use the unclipped full gradient as the stationarity residual.
5. Change the two-coordinate QP from the KKT unit, solve it by hand and with CVXPY and Clarabel, and record every KKT residual and the solver status. Derive soft thresholding, then run proximal gradient on a lasso with a non-identity $`A`$ and step $`1/\|A\|_2^2`$; check it against a closed form on a diagonal $`A`$ and against CVXPY and the lasso optimality residual on the general $`A`$.
6. Build the reductions: a log-sum-exp for finite nonempty inputs, left-to-right, balanced and Kahan sums, and online mean and variance, tested on cancellation, large offsets and float16 storage with float32 accumulation against math.fsum and float64 oracles. Diagnose one finite-precision failure end to end, such as the float16 running sum that stalls or the one-pass variance that returns zero, and show the repair.

**Deliverables**

- numlab/optim/: the optimizers with exit statuses and restartable state, the KKT and proximal code, and the reductions.
- The tests: rate predictions, the divergence projection, the noise checks, the AdamW oracle and resume, the KKT residual table, the lasso checks and the reduction oracles.
- notes/optimization.md: the predictions beside the measurements and both failure diagnoses.

**Checks**

- rubric: Self-grade with the rubric below.

| Criterion | Pass | Strong |
| --- | --- | --- |
| Geometry | Measured gradient-descent rates on all six quadratics are compared with the eigenvalue predictions. | Rotation is shown not to change the gradient-descent rate, with the reason, and momentum's gain is reported per gradient evaluation. |
| Divergence and noise | The divergent run is traced to the top eigenmode at the predicted factor, and the noise covariance and plateau match their formulas within Monte Carlo error. | The stopping statuses separate the divergent, stagnated and converged runs without manual inspection. |
| Adaptive state | AdamW matches PyTorch within 1e-12 and resume equals the uninterrupted run. | A test shows that restoring parameters without moments or the schedule clock changes the trajectory. |
| Certificates | The QP has every KKT residual and the solver status recorded, and the lasso passes its optimality residual. | Residuals carry stated tolerances, and solver success is never accepted without them. |
| Finite precision | Each reduction matches its oracle, and one finite-precision failure is diagnosed and repaired. | The note separates precision lost in storage from precision lost in accumulation. |

Feeds into: Capstone component 5, optimizer stability: the comparison, the divergence diagnosis and the finite-precision failure.

### Resource route

- **Primary - Course:** [Stanford EE364a - Convex Optimization](https://see.stanford.edu/Course/EE364A) - Follow lectures 1-9 and 15-16; use lecture 17 only for KKT systems. Leave full interior-point treatment for later.
- **Required - Theory:** [Convex Optimization](https://web.stanford.edu/~boyd/cvxbook/) - Read Chapters 1-5 and 9 with the course; use Chapter 10 only for equality-constrained Newton steps.
- **Required - Implementation:** [D2L - Optimization Algorithms](https://d2l.ai/chapter_optimization/) - Use the convexity, GD, SGD, minibatch, momentum, AdaGrad, RMSProp, Adam and scheduler sections for ML derivations and code.
- **Required - Numerics:** [Fundamentals of Numerical Computation](https://fncbook.com/python/) - Study §§1.1-1.4, 2.7-2.8, 3.2-3.4 and 4.2-4.3 for floating point, conditioning, stability, least squares and iteration error, in the Python edition.
- **Support - Reference:** [CVXPY basic and DCP tutorials](https://www.cvxpy.org/tutorial/intro/index.html) - Use as the solver oracle after deriving a constrained problem and its KKT conditions by hand.
- **Reference - Theory:** [Proximal Algorithms](https://web.stanford.edu/~boyd/papers/pdf/prox_algs.pdf) - Read Sections 1.1, 4.2 and the elementwise soft-thresholding formula in 6.5.2, then the lasso formulation on p. 196. Skip 7.1.1's penalty-scaling and Gram-rewrite errors on p. 197; derive the update from 4.2 and 6.5.2.
- **Reference - Reference:** [PyTorch optimizer and gradient-clipping contracts](https://docs.pytorch.org/docs/2.14/generated/torch.optim.AdamW.html) - Use AdamW's algorithm and clip_grad_norm_'s parameters to locate weight decay and clipping precisely. Inspect state_dict for optimizer restart; no network training is assigned.
- **Reference - Reference:** [SciPy minimize: BFGS](https://docs.scipy.org/doc/scipy/reference/optimize.minimize-bfgs.html) - Read the BFGS method description and gtol, maxiter, c1 and c2 options. Supply an analytic gradient and compare residuals and evaluation counts, not just iterations.
- **Reference - Reference:** [PyTorch numerical type information](https://docs.pytorch.org/docs/2.14/type_info.html) - Read torch.finfo's eps, max and smallest_normal fields and its subnormal note; inspect float64, float32, float16 and bfloat16 on CPU.
- **Reference - Theory:** [The Accuracy of Floating Point Summation](https://nhigham.com/wp-content/uploads/2023/10/high93s.pdf) - Read Section 2's recursive-sum error bound and Section 3's pairwise and compensated summation algorithms. Leave the statistical error models and historical machine details aside.
- **Support - Implementation:** [Accurately computing running variance](https://www.johndcook.com/blog/standard_deviation/) - Read the Welford mean and centered-sum recurrences. Prove the centered-sum invariant and translate the recurrence to NumPy; skip the C++ class.

### Exit checkpoint

Implement and compare optimizers on changed geometry, then diagnose one divergence and one finite-precision failure.

<details>
<summary>Deliberately left for later</summary>

- Interior-point implementation details
- Nonsmooth variational analysis
- Large-scale distributed optimizer design

</details>

## Stage milestone

### Numerical Learning Laboratory

Build a small NumPy project that connects least squares and PCA, reverse-mode differentiation, Monte Carlo uncertainty, experiment analysis and optimizer stability. Each component must include one failure case and one independent check.

- Derivations and assumption notes
- Runnable implementation with tests and raw numerical comparisons
- A short defense of solver, estimator and tolerance choices

**Capstone rubric** (about 10 to 14 hours)

| Criterion | Pass | Strong |
| --- | --- | --- |
| Least squares and PCA | The linear-algebra mini-project meets Pass on every criterion, and its rank-deficient case and conditioning table run from the suite. | The capstone README links the conditioning table to the solver choice in the defense note. |
| Reverse-mode differentiation | The engine and harness pass, and the planted bug fails its directional check. | One command reruns the h sweep and the planted-bug test. |
| Monte Carlo uncertainty | Every simulation check in the repository reports n and a standard error and uses the stated acceptance rule. | The heavy-tail failure and the drifting-predictive failure are both kept as tests. |
| Experiment analysis | The audit, the rerun and the decision memo are in the repository with the plan that preceded them. | The memo stands on its own for a reader who has not seen the code. |
| Optimizer stability | The optimizer comparison, the divergence diagnosis and the finite-precision failure are reproduced by the suite. | Each prediction sits beside its measurement in the notes. |
| Defense and rebuild | A short defense note justifies each solver, estimator and tolerance choice, and a README lists the commands that rebuild every reported number from a clean clone. | Every component has one failure case and one independent check named in the README, and the rebuild time is stated. |

