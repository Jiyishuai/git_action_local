
import subprocess
#print('printed in python')
def run_python_script(script, args):
    result = subprocess.run(["python", script] + args, capture_output=True, text=True)
    return result.stdout